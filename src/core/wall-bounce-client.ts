/**
 * Wall-Bounce API Client for Code Expert
 * Inherited from Scripter project
 */

import axios, { AxiosInstance } from 'axios';
import { WallBounceRequest, WallBounceResponse, GenerationOptions } from './types';

export class WallBounceClient {
  private client: AxiosInstance;
  private apiEndpoint: string;

  constructor(options: GenerationOptions = {}) {
    this.apiEndpoint = options.apiEndpoint || 'https://techsapo.com/api/v1/wall-bounce';

    this.client = axios.create({
      baseURL: this.apiEndpoint,
      timeout: 300000, // 5 minutes for LLM processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add basic auth if provided
    if (options.auth) {
      this.client.defaults.auth = {
        username: options.auth.username,
        password: options.auth.password,
      };
    }
  }

  /**
   * Analyze code using Wall-Bounce multi-LLM analysis
   */
  async analyze(
    query: string,
    options: {
      verbose?: boolean;
      context?: Record<string, any>;
    } = {}
  ): Promise<WallBounceResponse> {
    const request: WallBounceRequest = {
      query,
      mode: 'parallel',
      depth: 3,
      includeThinking: options.verbose || false,
      context: options.context,
    };

    try {
      const response = await this.client.post('/analyze', request);
      return this.parseResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;
        throw new Error(`Wall-Bounce API error: ${status} - ${message}`);
      }
      throw error;
    }
  }

  /**
   * Parse wall-bounce response
   */
  private parseResponse(data: any): WallBounceResponse {
    return {
      result: data.final_response || data.synthesis || data.result || '',
      consensus: data.consensus || data.consensus_score,
      providers: data.providers || data.llm_votes?.map((v: any) => v.provider),
      thinking: data.thinking || data.reasoning,
      metadata: {
        processingTime: data.processing_time,
        rounds: data.rounds,
        ...data.metadata,
      },
    };
  }

  /**
   * Health check for Wall-Bounce API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.apiEndpoint.replace('/api/v1/wall-bounce', '')}/health`,
        { timeout: 5000 }
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
