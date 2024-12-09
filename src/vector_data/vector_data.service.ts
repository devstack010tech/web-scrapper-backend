import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import puppeteer from 'puppeteer';
import { VectorData } from './entities/vector_data.entity';

import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VectorDataService {
  private openai: OpenAI;
  private filePath = path.join(__dirname, '../../sample.txt');

  constructor(
    @InjectRepository(VectorData)
    private readonly vectorDataRepository: Repository<VectorData>,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not defined in the environment variables.',
      );
    }

    this.openai = new OpenAI({ apiKey });
  }

  async create(url: string) {
    try {
      // Scrape website content
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'load', timeout: 0 });

      const content = await page.evaluate(() => document.body.innerText);
      await browser.close();

      // Convert content to vector
      const vector = await this.textToVector(content);

      console.log({ vector });

      // Store in database
      const vectorData = this.vectorDataRepository.create({
        url,
        content,
        vector,
      });

      await this.vectorDataRepository.save(vectorData);

      return 'Content stored successfully';
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape and store data.');
    }
  }

  async readFileData(): Promise<string> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return data;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  async getDataFromTextFile() {
    try {
      const fileData = await this.readFileData();

      console.log('test ,', { fileData });

      const content = `Based on the following text, provide a detailed response:\n\n${fileData}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: content }],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape and store data.');
    }
  }

  private async textToVector(text: string): Promise<number[]> {
    // Replace with a real NLP model for vectorization
    const tokens = text.split(' ');
    const vector = tokens.map((_, i) => i % 100); // Example vector
    return vector;
  }
}
