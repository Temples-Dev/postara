import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SocialAccount } from './social-account.entity';
import { SocialPost } from './social-post.entity';

@Entity('social_analytics')
export class SocialAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => SocialPost, (post) => post.analytics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: SocialPost;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => SocialAccount, (account) => account.analytics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: SocialAccount;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  comments: number;

  @Column({ default: 0 })
  shares: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn({ name: 'fetched_at' })
  fetchedAt: Date;
}
