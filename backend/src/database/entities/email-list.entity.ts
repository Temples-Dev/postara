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

import { Campaign } from './campaign.entity';
import { Subscriber } from './subscriber.entity';
import { Workspace } from './workspace.entity';

@Entity('email_lists')
export class EmailList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.emailLists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.emailList)
  campaigns: Campaign[];

  @OneToMany(() => Subscriber, (subscriber) => subscriber.emailList)
  subscribers: Subscriber[];
}
