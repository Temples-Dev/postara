import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Webhook } from './webhook.entity';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'webhook_id' })
  webhookId: string;

  @ManyToOne(() => Webhook, (webhook) => webhook.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'webhook_id' })
  webhook: Webhook;

  @Column()
  event: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  response: Record<string, unknown>;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ default: false })
  success: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
