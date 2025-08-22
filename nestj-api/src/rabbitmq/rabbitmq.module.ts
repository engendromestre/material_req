import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot({
      uri: 'amqp://admin:admin@localhost:5672',
    }),
    ],
    exports: [RabbitMQModule],
})
export class RabbitmqModule {}
