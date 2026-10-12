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

import { SocialAccount } from './social-account.entity';
import { SocialAnalytics } from './social-analytics.entity';
import { Workspace } from './workspace.entity';
import { SocialPostStatus } from '../enums';

@Entity('social_posts')
export class SocialPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.socialPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => SocialAccount, (account) => account.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: SocialAccount;

  @Column('text')
  content: string;

  @Column('text', { array: true, default: '{}', name: 'media_urls' })
  mediaUrls: string[];

  @Column({ type: 'enum', enum: SocialPostStatus, default: SocialPostStatus.DRAFT })
  status: SocialPostStatus;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true, unique: true })
  platformPostId: string;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SocialAnalytics, (analytics) => analytics.post)
  analytics: SocialAnalytics[];
}
