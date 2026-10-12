import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { CampaignAnalytics } from './campaign-analytics.entity';
import { EmailList } from './email-list.entity';
import { SubscriberStatus } from '../enums';

@Entity('subscribers')
@Unique(['listId', 'email'])
@Index(['email'])
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'list_id' })
  listId: string;

  @ManyToOne(() => EmailList, (list) => list.subscribers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  emailList: EmailList;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: SubscriberStatus, default: SubscriberStatus.PENDING })
  status: SubscriberStatus;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, unknown>;

  @Column({ nullable: true })
  subscribedAt: Date;

  @Column({ nullable: true })
  unsubscribedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CampaignAnalytics, (analytics) => analytics.subscriber)
  campaignAnalytics: CampaignAnalytics[];
}
