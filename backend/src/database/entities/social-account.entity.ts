import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { SocialAnalytics } from './social-analytics.entity';
import { SocialPost } from './social-post.entity';
import { Workspace } from './workspace.entity';
import { SocialAccountStatus, SocialPlatform } from '../enums';

@Entity('social_accounts')
@Unique(['platform', 'accountId'])
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.socialAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ type: 'enum', enum: SocialPlatform })
  platform: SocialPlatform;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'account_name' })
  accountName: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ type: 'enum', enum: SocialAccountStatus, default: SocialAccountStatus.ACTIVE })
  status: SocialAccountStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SocialAnalytics, (analytics) => analytics.account)
  analytics: SocialAnalytics[];

  @OneToMany(() => SocialPost, (post) => post.account)
  posts: SocialPost[];
}
