import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WebhookLog } from './webhook-log.entity';
import { Workspace } from './workspace.entity';
import { WebhookStatus } from '../enums';

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.webhooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column('text', { array: true, default: '{}' })
  events: string[];

  @Column()
  secret: string;

  @Column({ type: 'enum', enum: WebhookStatus, default: WebhookStatus.ACTIVE })
  status: WebhookStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WebhookLog, (log) => log.webhook)
  logs: WebhookLog[];
}
