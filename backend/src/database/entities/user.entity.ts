import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from './account.entity';
import { AiGeneration } from './ai-generation.entity';
import { ContentItem } from './content-item.entity';
import { Session } from './session.entity';
import { Workspace } from './workspace.entity';
import { WorkspaceMember } from './workspace-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => AiGeneration, (generation) => generation.user)
  aiGenerations: AiGeneration[];

  @OneToMany(() => ContentItem, (item) => item.user)
  contentItems: ContentItem[];

  @OneToMany(() => WorkspaceMember, (member) => member.user)
  workspaceMemberships: WorkspaceMember[];

  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  ownedWorkspaces: Workspace[];
}
