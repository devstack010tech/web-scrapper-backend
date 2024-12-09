import { Controller, Post, Body } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  async scrape(@Body('url') url: string) {
    if (!url) {
      return { error: 'URL is required' };
    }

    try {
      const analysis = await this.scraperService.scrapeWebsite(url);
      return { analysis };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('/store')
  async storeWebsiteData(@Body('url') url: string) {
    console.log({ url });
    if (!url) {
      return { error: 'URL is required' };
    }

    try {
      const analysis = await this.scraperService.scrapeAndStore(url);
      return { analysis };
    } catch (error) {
      return { error: error.message };
    }
  }
}
