import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateHandwritingCanvasDto,
  UpdateHandwritingCanvasDto,
  CreateVintageFilmDto,
  UpdateVintageFilmDto,
  CreateLivePhotoDto,
  UpdateLivePhotoDto,
  CreateBeforeAfterSliderDto,
  UpdateBeforeAfterSliderDto,
  CreateTypographyStampDto,
  UpdateTypographyStampDto,
  CreateBeatSyncVideoDto,
  UpdateBeatSyncVideoDto,
  CreateAIVoiceoverDto,
  UpdateAIVoiceoverDto,
  CreateMemorySoundtrackDto,
  UpdateMemorySoundtrackDto,
} from './dto/audiovisual.dto';

@Injectable()
export class AudiovisualService {
  constructor(private prisma: PrismaService) {}

  // ==================== Scrapbook Projects ====================

  async getScrapbookProjects(userId: string) {
    return this.prisma.scrapbookProject.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getScrapbookProject(userId: string, id: string) {
    const project = await this.prisma.scrapbookProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Scrapbook project not found');
    }

    if (project.userId !== userId && !project.isPublic) {
      throw new NotFoundException('Access denied');
    }

    return project;
  }

  async createScrapbookProject(userId: string, data: any) {
    return this.prisma.scrapbookProject.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        layoutData: JSON.stringify(data.layoutData || {}),
        isPublic: data.isPublic ?? false,
      },
    });
  }

  async updateScrapbookProject(userId: string, id: string, data: any) {
    const project = await this.prisma.scrapbookProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Scrapbook project not found');
    }

    if (project.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.scrapbookProject.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        layoutData: data.layoutData ? JSON.stringify(data.layoutData) : undefined,
        isPublic: data.isPublic,
      },
    });
  }

  async deleteScrapbookProject(userId: string, id: string) {
    const project = await this.prisma.scrapbookProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Scrapbook project not found');
    }

    if (project.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.scrapbookProject.delete({
      where: { id },
    });
  }

  // ==================== Soundscape Mixes ====================

  async getSoundscapeMixes(userId: string) {
    return this.prisma.soundscapeMix.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSoundscapeMix(userId: string, id: string) {
    const mix = await this.prisma.soundscapeMix.findUnique({
      where: { id },
    });

    if (!mix) {
      throw new NotFoundException('Soundscape mix not found');
    }

    if (mix.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return mix;
  }

  async createSoundscapeMix(userId: string, data: any) {
    return this.prisma.soundscapeMix.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        memoryId: data.memoryId,
        mixData: JSON.stringify(data.mixData || {}),
        duration: data.duration || 60,
        audioUrl: data.audioUrl,
      },
    });
  }

  async updateSoundscapeMix(userId: string, id: string, data: any) {
    const mix = await this.prisma.soundscapeMix.findUnique({
      where: { id },
    });

    if (!mix) {
      throw new NotFoundException('Soundscape mix not found');
    }

    if (mix.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.soundscapeMix.update({
      where: { id },
      data: {
        title: data.title,
        mixData: data.mixData ? JSON.stringify(data.mixData) : undefined,
        duration: data.duration,
        audioUrl: data.audioUrl,
      },
    });
  }

  async deleteSoundscapeMix(userId: string, id: string) {
    const mix = await this.prisma.soundscapeMix.findUnique({
      where: { id },
    });

    if (!mix) {
      throw new NotFoundException('Soundscape mix not found');
    }

    if (mix.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.soundscapeMix.delete({
      where: { id },
    });
  }

  // ==================== Handwriting Canvas ====================

  async getHandwritingCanvases(userId: string) {
    return this.prisma.handwritingCanvas.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createHandwritingCanvas(userId: string, dto: CreateHandwritingCanvasDto) {
    return this.prisma.handwritingCanvas.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateHandwritingCanvas(id: string, userId: string, dto: UpdateHandwritingCanvasDto) {
    const canvas = await this.prisma.handwritingCanvas.findUnique({
      where: { id },
    });

    if (!canvas) {
      throw new NotFoundException('Handwriting canvas not found');
    }

    if (canvas.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.handwritingCanvas.update({
      where: { id },
      data: dto,
    });
  }

  async deleteHandwritingCanvas(id: string, userId: string) {
    const canvas = await this.prisma.handwritingCanvas.findUnique({
      where: { id },
    });

    if (!canvas) {
      throw new NotFoundException('Handwriting canvas not found');
    }

    if (canvas.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.handwritingCanvas.delete({
      where: { id },
    });
  }

  // ==================== Vintage Film Emulation ====================

  async getVintageFilms(userId: string) {
    return this.prisma.vintageFilmEmulation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVintageFilm(userId: string, dto: CreateVintageFilmDto) {
    return this.prisma.vintageFilmEmulation.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateVintageFilm(id: string, userId: string, dto: UpdateVintageFilmDto) {
    const film = await this.prisma.vintageFilmEmulation.findUnique({
      where: { id },
    });

    if (!film) {
      throw new NotFoundException('Vintage film not found');
    }

    if (film.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.vintageFilmEmulation.update({
      where: { id },
      data: dto,
    });
  }

  async deleteVintageFilm(id: string, userId: string) {
    const film = await this.prisma.vintageFilmEmulation.findUnique({
      where: { id },
    });

    if (!film) {
      throw new NotFoundException('Vintage film not found');
    }

    if (film.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.vintageFilmEmulation.delete({
      where: { id },
    });
  }

  // ==================== Live Photo Motion Viewer ====================

  async getLivePhotos(userId: string) {
    return this.prisma.livePhotoMotionViewer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLivePhoto(userId: string, dto: CreateLivePhotoDto) {
    return this.prisma.livePhotoMotionViewer.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateLivePhoto(id: string, userId: string, dto: UpdateLivePhotoDto) {
    const livePhoto = await this.prisma.livePhotoMotionViewer.findUnique({
      where: { id },
    });

    if (!livePhoto) {
      throw new NotFoundException('Live photo not found');
    }

    if (livePhoto.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.livePhotoMotionViewer.update({
      where: { id },
      data: dto,
    });
  }

  async deleteLivePhoto(id: string, userId: string) {
    const livePhoto = await this.prisma.livePhotoMotionViewer.findUnique({
      where: { id },
    });

    if (!livePhoto) {
      throw new NotFoundException('Live photo not found');
    }

    if (livePhoto.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.livePhotoMotionViewer.delete({
      where: { id },
    });
  }

  // ==================== Before/After Slider ====================

  async getBeforeAfterSliders(userId: string) {
    return this.prisma.beforeAfterSlider.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBeforeAfterSlider(userId: string, dto: CreateBeforeAfterSliderDto) {
    return this.prisma.beforeAfterSlider.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateBeforeAfterSlider(id: string, userId: string, dto: UpdateBeforeAfterSliderDto) {
    const slider = await this.prisma.beforeAfterSlider.findUnique({
      where: { id },
    });

    if (!slider) {
      throw new NotFoundException('Before/after slider not found');
    }

    if (slider.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.beforeAfterSlider.update({
      where: { id },
      data: dto,
    });
  }

  async deleteBeforeAfterSlider(id: string, userId: string) {
    const slider = await this.prisma.beforeAfterSlider.findUnique({
      where: { id },
    });

    if (!slider) {
      throw new NotFoundException('Before/after slider not found');
    }

    if (slider.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.beforeAfterSlider.delete({
      where: { id },
    });
  }

  // ==================== Typography Stamp Studio ====================

  async getTypographyStamps(userId: string) {
    return this.prisma.typographyStampStudio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTypographyStamp(userId: string, dto: CreateTypographyStampDto) {
    return this.prisma.typographyStampStudio.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateTypographyStamp(id: string, userId: string, dto: UpdateTypographyStampDto) {
    const stamp = await this.prisma.typographyStampStudio.findUnique({
      where: { id },
    });

    if (!stamp) {
      throw new NotFoundException('Typography stamp not found');
    }

    if (stamp.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.typographyStampStudio.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTypographyStamp(id: string, userId: string) {
    const stamp = await this.prisma.typographyStampStudio.findUnique({
      where: { id },
    });

    if (!stamp) {
      throw new NotFoundException('Typography stamp not found');
    }

    if (stamp.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.typographyStampStudio.delete({
      where: { id },
    });
  }

  // ==================== Beat Sync Video Generator ====================

  async getBeatSyncVideos(userId: string) {
    return this.prisma.beatSyncVideoGenerator.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBeatSyncVideo(userId: string, dto: CreateBeatSyncVideoDto) {
    return this.prisma.beatSyncVideoGenerator.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateBeatSyncVideo(id: string, userId: string, dto: UpdateBeatSyncVideoDto) {
    const video = await this.prisma.beatSyncVideoGenerator.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException('Beat sync video not found');
    }

    if (video.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.beatSyncVideoGenerator.update({
      where: { id },
      data: dto,
    });
  }

  async deleteBeatSyncVideo(id: string, userId: string) {
    const video = await this.prisma.beatSyncVideoGenerator.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException('Beat sync video not found');
    }

    if (video.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.beatSyncVideoGenerator.delete({
      where: { id },
    });
  }

  // ==================== AI Voiceover Commentary ====================

  async getAIVoiceovers(userId: string) {
    return this.prisma.aIVoiceoverCommentary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAIVoiceover(userId: string, dto: CreateAIVoiceoverDto) {
    return this.prisma.aIVoiceoverCommentary.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateAIVoiceover(id: string, userId: string, dto: UpdateAIVoiceoverDto) {
    const voiceover = await this.prisma.aIVoiceoverCommentary.findUnique({
      where: { id },
    });

    if (!voiceover) {
      throw new NotFoundException('AI voiceover not found');
    }

    if (voiceover.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.aIVoiceoverCommentary.update({
      where: { id },
      data: dto,
    });
  }

  async deleteAIVoiceover(id: string, userId: string) {
    const voiceover = await this.prisma.aIVoiceoverCommentary.findUnique({
      where: { id },
    });

    if (!voiceover) {
      throw new NotFoundException('AI voiceover not found');
    }

    if (voiceover.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.aIVoiceoverCommentary.delete({
      where: { id },
    });
  }

  // ==================== Memory Soundtrack Mashup ====================

  async getMemorySoundtracks(userId: string) {
    return this.prisma.memorySoundtrackMashup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMemorySoundtrack(userId: string, dto: CreateMemorySoundtrackDto) {
    return this.prisma.memorySoundtrackMashup.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateMemorySoundtrack(id: string, userId: string, dto: UpdateMemorySoundtrackDto) {
    const soundtrack = await this.prisma.memorySoundtrackMashup.findUnique({
      where: { id },
    });

    if (!soundtrack) {
      throw new NotFoundException('Memory soundtrack not found');
    }

    if (soundtrack.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.memorySoundtrackMashup.update({
      where: { id },
      data: dto,
    });
  }

  async deleteMemorySoundtrack(id: string, userId: string) {
    const soundtrack = await this.prisma.memorySoundtrackMashup.findUnique({
      where: { id },
    });

    if (!soundtrack) {
      throw new NotFoundException('Memory soundtrack not found');
    }

    if (soundtrack.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.memorySoundtrackMashup.delete({
      where: { id },
    });
  }
}
