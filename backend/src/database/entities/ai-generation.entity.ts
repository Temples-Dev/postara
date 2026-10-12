import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';
import { AIContentType, AIGenerationStatus } from '../enums';

@Entity('ai_generations')
export class AiGeneration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.aiGenerations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: AIContentType })
  type: AIContentType;

  @Column('text')
  prompt: string;

  @Column('text')
  content: string;

  @Column({ default: 'gpt-4' })
  model: string;

  @Column({ default: 0 })
  tokens: number;

  @Column({ type: 'enum', enum: AIGenerationStatus, default: AIGenerationStatus.COMPLETED })
  status: AIGenerationStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
