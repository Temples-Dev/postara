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

import { CampaignAnalytics } from './campaign-analytics.entity';
import { EmailList } from './email-list.entity';
import { Workspace } from './workspace.entity';
import { CampaignStatus } from '../enums';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.campaigns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ name: 'list_id' })
  listId: string;

  @ManyToOne(() => EmailList, (list) => list.campaigns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  emailList: EmailList;

  @Column()
  name: string;

  @Column()
  subject: string;

  @Column({ nullable: true })
  preheader: string;

  @Column()
  fromName: string;

  @Column()
  fromEmail: string;

  @Column({ nullable: true })
  replyTo: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  sentAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CampaignAnalytics, (analytics) => analytics.campaign)
  analytics: CampaignAnalytics[];
}
