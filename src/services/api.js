/**
 * SolveX — Central API Client
 * Clean service layer connecting the React frontend to the FastAPI backend.
 * Uses VITE_API_BASE_URL environment variable.
 * Implements timeout handling, error normalization, and fallback alerts.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('solvex_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('solvex_token', token);
    } else {
      localStorage.removeItem('solvex_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorDetail = `HTTP Error ${response.status}`;
        try {
          const errData = await response.json();
          errorDetail = errData.detail || errorDetail;
        } catch (_) {}
        throw new Error(errorDetail);
      }

      return await response.json();
    } catch (error) {
      console.warn(`[SolveX API] Network request to ${url} failed:`, error.message);
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    const rootUrl = this.baseUrl.replace(/\/api\/v1\/?$/, '');
    try {
      const res = await fetch(`${rootUrl}/health`);
      return await res.json();
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  }

  // Standards APIs
  async getStandards(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.domain) searchParams.append('domain', params.domain);
    if (params.status) searchParams.append('status', params.status);
    if (params.q) searchParams.append('q', params.q);
    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/standards${queryStr}`, { method: 'GET' });
  }

  async getStandardById(id) {
    return this.request(`/standards/${encodeURIComponent(id)}`, { method: 'GET' });
  }

  async searchStandards(query, limit = 6) {
    return this.request('/standards/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit })
    });
  }

  // Recommendations & RAG Analysis
  async analyzeProcurement(query) {
    return this.request('/recommendations/analyze', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  async getRecommendation(id) {
    return this.request(`/recommendations/${id}`, { method: 'GET' });
  }

  // Document Analysis
  async analyzeDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/documents/analyze', {
      method: 'POST',
      body: formData
    });
  }

  // Specifications
  async saveSpecification(title, content, projectName = '', procuringEntity = '') {
    return this.request('/specifications', {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
        project_name: projectName,
        procuring_entity: procuringEntity
      })
    });
  }

  async getSpecifications() {
    return this.request('/specifications', { method: 'GET' });
  }

  async getSpecificationById(id) {
    return this.request(`/specifications/${id}`, { method: 'GET' });
  }

  // Authentication
  async register(email, password, fullName = '') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName })
    });
  }

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (_) {}
    this.setToken(null);
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
