import { Controller, Post, Body, Get } from '@nestjs/common';
import { VectorDataService } from './vector_data.service';

@Controller('vector-data')
export class VectorDataController {
  constructor(private readonly vectorDataService: VectorDataService) {}

  @Post('/store')
  async storeWebsiteData(@Body('url') url: string) {
    if (!url) {
      return { error: 'URL is required' };
    }

    try {
      const analysis = await this.vectorDataService.create(url);
      return { analysis };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('')
  async getDataFromTextFile() {
    try {
      const res = await this.vectorDataService.getDataFromTextFile();
      return { res };
    } catch (error) {
      return { error: error.message };
    }
  }
}
