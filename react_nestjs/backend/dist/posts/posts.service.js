"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../entities/post.entity");
let PostsService = class PostsService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async create(createPostDto, user) {
        const post = this.postsRepository.create(Object.assign(Object.assign({}, createPostDto), { author: user, authorId: user.id }));
        return await this.postsRepository.save(post);
    }
    async findAll(user) {
        return this.postsRepository.find({
            where: [
                { permission: post_entity_1.Permission.PUBLIC },
                { authorId: user.id }
            ],
            relations: ['author'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id, user) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author']
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        if (post.permission === post_entity_1.Permission.PRIVATE && post.authorId !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to view this post');
        }
        return post;
    }
    async update(id, updatePostDto, user) {
        const post = await this.findOne(id, user);
        if (post.authorId !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own posts');
        }
        Object.assign(post, updatePostDto);
        return this.postsRepository.save(post);
    }
    async remove(id, user) {
        const post = await this.findOne(id, user);
        if (post.authorId !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.postsRepository.remove(post);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map