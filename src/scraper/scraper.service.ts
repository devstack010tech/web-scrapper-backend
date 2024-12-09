import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScraperService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not defined in the environment variables.',
      );
    }

    this.openai = new OpenAI({ apiKey });
  }

  async scrapeWebsite(url: string): Promise<string> {
    try {
      // Launch Puppeteer and scrape content
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'load', timeout: 0 });

      const content = await page.evaluate(() => document.body.innerText);

      await browser.close();

      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [
          {
            role: 'system',
            content: 'You are an assistant analyzing web content.',
          },
          {
            role: 'user',
            content: `Analyze the following content:\n\n${content}`,
          },
        ],
        model: 'gpt-4o',
      };
      // Send scraped content to ChatGPT API
      const response: OpenAI.Chat.ChatCompletion =
        await this.openai.chat.completions.create(params);

      return response.choices[0].message.content || 'Server content issue';
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape website.');
    }
  }

  async scrapeAndStore(url: string): Promise<string> {
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

      return 'Data stored successfully';
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape and store data.');
    }
  }

  private async textToVector(text: string): Promise<number[]> {
    // Dummy implementation for vectorization
    // Replace with a real NLP model for vectorization
    const tokens = text.split(' ');
    const vector = tokens.map((_, i) => i % 100); // Example vector
    return vector;
  }
}
