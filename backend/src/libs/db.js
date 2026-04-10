import mongoose from 'mongoose';
import dns from 'node:dns';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_CONNECTIONSTRING;

  if (!mongoUri) {
    console.error('Thiếu biến môi trường MONGODB_CONNECTIONSTRING');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      family: 4 // Ép dùng IPv4, giúp tránh lỗi DNS trên một số hệ điều hành
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const isSrvDnsRefused =
      mongoUri.startsWith('mongodb+srv://') &&
      (error?.code === 'ECONNREFUSED' || `${error?.message}`.includes('querySrv ECONNREFUSED'));

    if (isSrvDnsRefused) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        console.warn('DNS SRV bị từ chối. Thử lại với DNS công cộng 8.8.8.8/1.1.1.1...');
        const conn = await mongoose.connect(mongoUri, { family: 4 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error(`Lỗi kết nối sau khi retry DNS: ${retryError.message}`);
        process.exit(1);
      }
    }

    console.error(`Lỗi kết nối: ${error.message}`);
    process.exit(1);
  }
};

