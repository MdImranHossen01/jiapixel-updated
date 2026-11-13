import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGlobalSettings extends Document {
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleMeta?: string;
  facebookDomainVerification?: string;
  metaPixelId?: string;
  facebookAccessToken?: string;
  facebookTestEventCode?: string;
  tiktokPixelId?: string;
  tiktokAccessToken?: string;
  tiktokDomainVerification?: string;
  tiktokTestEventCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GlobalSettingsSchema: Schema<IGlobalSettings> = new Schema(
  {
    googleTagManagerId: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
    googleSearchConsoleMeta: { type: String, default: '' },
    facebookDomainVerification: { type: String, default: '' },
    metaPixelId: { type: String, default: '' },
    facebookAccessToken: { type: String, default: '' },
    facebookTestEventCode: { type: String, default: '' },
    tiktokPixelId: { type: String, default: '' },
    tiktokAccessToken: { type: String, default: '' },
    tiktokDomainVerification: { type: String, default: '' },
    tiktokTestEventCode: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const GlobalSettings: Model<IGlobalSettings> =
  mongoose.models.GlobalSettings ||
  mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);

export default GlobalSettings;

