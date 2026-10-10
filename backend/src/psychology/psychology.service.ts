import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReminiscenceTherapyDto,
  UpdateReminiscenceTherapyDto,
} from './dto/reminiscence-therapy.dto';
import {
  CreateInnerChildDialogueDto,
} from './dto/inner-child-dialogue.dto';
import {
  CreateBinauralSoundTherapyDto,
  UpdateBinauralSoundTherapyDto,
} from './dto/binaural-sound-therapy.dto';
import {
  CreateZenReflectionDto,
  UpdateZenReflectionDto,
} from './dto/zen-reflection.dto';
import {
  CreateEmotionalWaveformDto,
  UpdateEmotionalWaveformDto,
} from './dto/emotional-waveform.dto';
import {
  CreateDreamJournalDto,
  UpdateDreamJournalDto,
} from './dto/dream-journal.dto';

@Injectable()
export class PsychologyService {
  constructor(private prisma: PrismaService) {}

  // ==================== Emotional Geography Heatmap ====================

  async getEmotionalGeographyPoints(userId: string) {
    return this.prisma.emotionalGeographyPoint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEmotionalGeographyPoint(
    userId: string,
    memoryId: string,
    latitude: number,
    longitude: number,
    emotionType: string,
    intensity: number,
  ) {
    return this.prisma.emotionalGeographyPoint.create({
      data: {
        user: { connect: { id: userId } },
        memoryId,
        latitude,
        longitude,
        emotionType,
        intensity,
      },
    });
  }

  // ==================== Reminiscence Therapy ====================

  async getReminiscenceSessions(userId: string) {
    return this.prisma.reminiscenceTherapySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReminiscenceSession(userId: string, dto: CreateReminiscenceTherapyDto) {
    return this.prisma.reminiscenceTherapySession.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateReminiscenceSession(id: string, userId: string, dto: UpdateReminiscenceTherapyDto) {
    const session = await this.prisma.reminiscenceTherapySession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.reminiscenceTherapySession.update({
      where: { id },
      data: {
        ...dto,
        completedAt: dto.response ? new Date() : null,
      },
    });
  }

  // ==================== Inner Child Dialogue ====================

  async getInnerChildDialogues(userId: string) {
    return this.prisma.innerChildDialogue.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInnerChildDialogue(userId: string, dto: CreateInnerChildDialogueDto) {
    return this.prisma.innerChildDialogue.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  // ==================== Binaural Sound Therapy ====================

  async getBinauralTherapies(userId: string) {
    return this.prisma.binauralSoundTherapy.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
    });
  }

  async createBinauralTherapy(userId: string, dto: CreateBinauralSoundTherapyDto) {
    return this.prisma.binauralSoundTherapy.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateBinauralTherapy(id: string, userId: string, dto: UpdateBinauralSoundTherapyDto) {
    const therapy = await this.prisma.binauralSoundTherapy.findUnique({
      where: { id },
    });

    if (!therapy) {
      throw new NotFoundException('Therapy session not found');
    }

    if (therapy.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.binauralSoundTherapy.update({
      where: { id },
      data: dto,
    });
  }

  // ==================== Zen Reflection Mode ====================

  async getZenReflectionMode(userId: string) {
    let zenMode = await this.prisma.zenReflectionMode.findUnique({
      where: { userId },
    });

    if (!zenMode) {
      zenMode = await this.prisma.zenReflectionMode.create({
        data: {
          userId,
          isEnabled: false,
          theme: 'monochrome',
          hideMetrics: true,
          breathingReminder: false,
          breathingInterval: 5,
        },
      });
    }

    return zenMode;
  }

  async updateZenReflectionMode(userId: string, dto: UpdateZenReflectionDto) {
    const zenMode = await this.getZenReflectionMode(userId);

    return this.prisma.zenReflectionMode.update({
      where: { id: zenMode.id },
      data: dto,
    });
  }

  // ==================== Emotional Waveform Timeline ====================

  async getEmotionalWaveforms(userId: string) {
    return this.prisma.emotionalWaveform.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async createEmotionalWaveform(userId: string, dto: CreateEmotionalWaveformDto) {
    return this.prisma.emotionalWaveform.create({
      data: {
        user: { connect: { id: userId } },
        date: new Date(dto.date),
        ...dto,
      },
    });
  }

  async updateEmotionalWaveform(id: string, userId: string, dto: UpdateEmotionalWaveformDto) {
    const waveform = await this.prisma.emotionalWaveform.findUnique({
      where: { id },
    });

    if (!waveform) {
      throw new NotFoundException('Waveform entry not found');
    }

    if (waveform.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.emotionalWaveform.update({
      where: { id },
      data: dto,
    });
  }

  async deleteEmotionalWaveform(id: string, userId: string) {
    const waveform = await this.prisma.emotionalWaveform.findUnique({
      where: { id },
    });

    if (!waveform) {
      throw new NotFoundException('Waveform entry not found');
    }

    if (waveform.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.emotionalWaveform.delete({
      where: { id },
    });
  }

  // ==================== Dream Journal ====================

  async getDreamJournals(userId: string) {
    return this.prisma.dreamJournal.findMany({
      where: { userId },
      orderBy: { dreamDate: 'desc' },
    });
  }

  async createDreamJournal(userId: string, dto: CreateDreamJournalDto) {
    return this.prisma.dreamJournal.create({
      data: {
        user: { connect: { id: userId } },
        dreamDate: new Date(dto.dreamDate),
        ...dto,
      },
    });
  }

  async updateDreamJournal(id: string, userId: string, dto: UpdateDreamJournalDto) {
    const journal = await this.prisma.dreamJournal.findUnique({
      where: { id },
    });

    if (!journal) {
      throw new NotFoundException('Dream journal not found');
    }

    if (journal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.dreamJournal.update({
      where: { id },
      data: {
        ...dto,
        dreamDate: dto.dreamDate ? new Date(dto.dreamDate) : undefined,
      },
    });
  }

  async deleteDreamJournal(id: string, userId: string) {
    const journal = await this.prisma.dreamJournal.findUnique({
      where: { id },
    });

    if (!journal) {
      throw new NotFoundException('Dream journal not found');
    }

    if (journal.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.dreamJournal.delete({
      where: { id },
    });
  }
}
