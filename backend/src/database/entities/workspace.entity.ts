import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Campaign } from './campaign.entity';
import { ContentItem } from './content-item.entity';
import { EmailList } from './email-list.entity';
import { SocialAccount } from './social-account.entity';
import { SocialPost } from './social-post.entity';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';
import { Webhook } from './webhook.entity';
import { WorkspaceMember } from './workspace-member.entity';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.ownedWorkspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WorkspaceMember, (member) => member.workspace)
  members: WorkspaceMember[];

  @OneToMany(() => Campaign, (campaign) => campaign.workspace)
  campaigns: Campaign[];

  @OneToMany(() => ContentItem, (item) => item.workspace)
  contentItems: ContentItem[];

  @OneToMany(() => EmailList, (list) => list.workspace)
  emailLists: EmailList[];

  @OneToMany(() => SocialAccount, (account) => account.workspace)
  socialAccounts: SocialAccount[];

  @OneToMany(() => SocialPost, (post) => post.workspace)
  socialPosts: SocialPost[];

  @OneToOne(() => Subscription, (subscription) => subscription.workspace)
  subscription: Subscription;

  @OneToMany(() => Webhook, (webhook) => webhook.workspace)
  webhooks: Webhook[];
}
