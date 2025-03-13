export interface ExportConfig {
  title: string;
  description: string;
  includeOrbitControls: boolean;
  includeLighting: boolean;
  includeStats: boolean;
  backgroundColor: string;
  responsive: boolean;
}

export interface GeneratedScene {
  html: string;
  preview_url: string;
} 