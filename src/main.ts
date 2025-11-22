import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  const logstashUrl = process.env.LOGSTASH_URL ?? 'http://logstash:8080';

  // універсальна функція логування
  const sendLog = async (
    level: string,
    message: string,
    extra: any = {},
    retries = 5
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        await axios.post(logstashUrl, {
          timestamp: new Date().toISOString(),
          level,
          message,
          ...extra,
        });
        console.log(`✅ Sent log to Logstash: ${level} - ${message}`);
        return;
      } catch (err) {
        console.warn(`⚠️ Logstash not ready (attempt ${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    console.error('❌ Failed to send log to Logstash after all retries');
  };

  // лог кожного HTTP-запиту
  app.use(async (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 400 ? 'ERROR' : 'INFO';
      const message = `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
      sendLog(level, message);
    });
    next();
  });

  await app.listen(port);
  console.log(`🚀 App running on http://localhost:${port}`);

  // стартові тести
  setTimeout(() => sendLog('INFO', `App started on port ${port}`), 3000);
  setTimeout(() => sendLog('ERROR', 'Simulated error from app'), 6000);
}

bootstrap();
