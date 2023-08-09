import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GameInvitation,
  GameInvitationStatus,
} from 'src/typeorm/game_invitation.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateGameInvitationDto } from '../dto/create-game-invitation.dto';
import { UpdateGameInvitationDto } from '../dto/update-game-invitation.dto';

@Injectable()
export class GameInvitationService {
  constructor(
    @InjectRepository(GameInvitation)
    private gameInvitationRepository: Repository<GameInvitation>,
    private readonly userService: UsersService,
  ) {}

  async create(createGameInvitationDto: CreateGameInvitationDto) {
    const { senderId, receiverId, status } = createGameInvitationDto;
    const sender = await this.userService.findUsersById(senderId);
    const receiver = await this.userService.findUsersById(receiverId);
    if (!sender || !receiver) {
      throw new NotFoundException('Invalid sender or receiver');
    }
    if (sender === receiver) {
      throw new ConflictException('sender and receiver same');
    }
    const existingInvitation = await this.gameInvitationRepository.findOne({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
        status: GameInvitationStatus.PENDING,
      },
    });
    if (existingInvitation) {
      throw new ConflictException('Invitation already sent');
    }
    const gameInvitation = new GameInvitation();
    gameInvitation.sender = sender;
    gameInvitation.receiver = receiver;
    gameInvitation.status = status;

    await this.gameInvitationRepository.save(gameInvitation);
    return gameInvitation;
  }

  async findAll(): Promise<GameInvitation[]> {
    return await this.gameInvitationRepository.find({
      relations: ['sender', 'receiver'],
    });
  }

  async findOne(id: number) {
    const gameInvitation = this.gameInvitationRepository.findOne({
      relations: ['sender', 'receiver'],
      where: {
        id: id,
      },
    });
    if (!gameInvitation)
      throw new NotFoundException('Game Invitation not found');
    return gameInvitation;
  }

  async update(id: number, updateGameInvitationDto: UpdateGameInvitationDto) {
    const gameInvitation = await this.findOne(id);
    if (!gameInvitation) {
      throw new NotFoundException('Game Invitation not found');
    }
    if (updateGameInvitationDto.senderId) {
      const sender = await this.userService.findUsersById(
        updateGameInvitationDto.senderId,
      );
      gameInvitation.sender = sender;
    }
    if (updateGameInvitationDto.receiverId) {
      const receiver = await this.userService.findUsersById(
        updateGameInvitationDto.receiverId,
      );
      gameInvitation.receiver = receiver;
    }
    if (updateGameInvitationDto.status) {
      gameInvitation.status = updateGameInvitationDto.status;
      if (updateGameInvitationDto.status === GameInvitationStatus.ACCEPTED) {
        gameInvitation.acceptedAt = new Date();
      } else if (
        updateGameInvitationDto.status === GameInvitationStatus.DECLINED
      ) {
        gameInvitation.declinedAt = new Date();
      }
    }
    await this.gameInvitationRepository.save(gameInvitation);
    return gameInvitation;
  }

  async remove(id: number) {
    const gameInvitation = this.findOne(id);
    if (!gameInvitation) {
      throw new NotFoundException('Game Invitation not found');
    }
    return this.gameInvitationRepository.delete(id);
  }

  async findGameInvitationBySenderId(senderId: number) {
    return await this.gameInvitationRepository.find({
      relations: ['sender', 'receiver'],
      where: {
        sender: { id: senderId },
      },
    });
  }

  async findGameInvitationByReceiverId(receiverId: number) {
    return await this.gameInvitationRepository.find({
      relations: ['sender', 'receiver'],
      where: {
        receiver: { id: receiverId },
        status: GameInvitationStatus.PENDING,
      },
    });
  }

  async findGameInvitationBySenderIdAndReceiverId(
    senderId: number,
    receiverId: number,
  ) {
    return await this.gameInvitationRepository.findOne({
      relations: ['sender', 'receiver'],
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
      },
    });
  }
}
