import { Injectable } from '@nestjs/common';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Product } from 'src/product/product.types';

@Injectable()
export class EnhancementService {
    private openai: OpenAI;
    private promptTemplate: PromptTemplate;

    constructor() {
        this.openai = new OpenAI({
            configuration: {
                organization: process.env.OPENAI_ORGANIZATION
            },
            model: "gpt-3.5-turbo",
            maxRetries: 1,
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.promptTemplate = new PromptTemplate({
            template: "Enhance this product description:\n\nProduct name: {name}\nProduct description: {description}\nCategory: {category}\n\nNew Description:",
            inputVariables: ["name", "description", "category"],
        });
    }

    async enhanceDescriptions(products: Product[]): Promise<void> {
        const requests = products.map(async (product) => {
            const descriptionInput = product.description || '';
            const response = await this.promptTemplate.pipe(this.openai).invoke({
                name: product.name,
                description: descriptionInput,
                category: product.categoryName,
            });
            product.description = response.trim()
        });

        await Promise.all(requests);
    }
}
