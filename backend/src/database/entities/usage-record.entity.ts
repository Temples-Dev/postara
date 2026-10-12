import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Subscription } from './subscription.entity';
import { UsageType } from '../enums';

@Entity('usage_records')
@Unique(['subscriptionId', 'type', 'month'])
export class UsageRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_id' })
  subscriptionId: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.usageRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ type: 'enum', enum: UsageType })
  type: UsageType;

  @Column({ default: 0 })
  count: number;

  @Column({ type: 'timestamptz' })
  month: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
