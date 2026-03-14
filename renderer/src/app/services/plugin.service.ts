import { Injectable } from '@angular/core';

export interface PluginInfo {
  id: string;
  name: string;
  iconPath: string;
  status: 'active' | 'error' | 'pending';
  error?: string;
}

export interface PluginParam {
  key: string;
  type: 'text' | 'number' | 'boolean' | 'range' | 'file';
  label: string;
  defaultValue?: any;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  accept?: string;
  maxSizeKb?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PluginService {

  constructor() { }

  async listPlugins(): Promise<{ success: boolean; plugins: PluginInfo[]; error?: string }> {
    return (window as any).electronAPI.invoke('plugins:list');
  }

  async getParams(pluginId: string): Promise<{ success: boolean; pluginId: string; params: PluginParam[]; error?: string }> {
    return (window as any).electronAPI.invoke('plugins:params', { pluginId });
  }

  async updateParams(pluginId: string, params: any): Promise<{ success: boolean; pluginId: string; message?: string; error?: string }> {
    return (window as any).electronAPI.invoke('plugins:update', { pluginId, params });
  }
}
