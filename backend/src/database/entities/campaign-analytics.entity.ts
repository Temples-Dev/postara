import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Campaign } from './campaign.entity';
import { Subscriber } from './subscriber.entity';

@Entity('campaign_analytics')
@Unique(['campaignId', 'subscriberId'])
export class CampaignAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'campaign_id' })
  campaignId: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.analytics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ name: 'subscriber_id' })
  subscriberId: string;

  @ManyToOne(() => Subscriber, (subscriber) => subscriber.campaignAnalytics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: Subscriber;

  @Column({ default: false })
  sent: boolean;

  @Column({ default: false })
  delivered: boolean;

  @Column({ default: false })
  opened: boolean;

  @Column({ default: false })
  clicked: boolean;

  @Column({ default: false })
  bounced: boolean;

  @Column({ default: false })
  complained: boolean;

  @Column({ default: false })
  unsubscribed: boolean;

  @Column({ nullable: true })
  openedAt: Date;

  @Column({ nullable: true })
  clickedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
