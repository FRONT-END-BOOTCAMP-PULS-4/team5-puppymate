import { PostLikeRepository } from '@/domain/repositories/PostLikeRepository';

export default class CreatePostUsecase {
  private readonly postLikeRepository: PostLikeRepository;

  constructor(postLikeRepository: PostLikeRepository) {
    this.postLikeRepository = postLikeRepository;
  }

  async execute(userId: number, postId: number): Promise<void> {
    await this.postLikeRepository.create(userId, postId);
  }
}
