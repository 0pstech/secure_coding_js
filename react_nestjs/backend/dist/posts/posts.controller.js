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
var PostsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const posts_dto_1 = require("./dto/posts.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../decorators/user.decorator");
let PostsController = PostsController_1 = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
        this.logger = new common_1.Logger(PostsController_1.name);
    }
    async create(createPostDto, user) {
        this.logger.log(`게시글 작성 시도: ${user.email}`);
        try {
            const result = await this.postsService.create(createPostDto, user);
            this.logger.log(`게시글 작성 성공: ${user.email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`게시글 작성 실패: ${user.email}`, error.stack);
            throw error;
        }
    }
    async findAll(req) {
        this.logger.log('게시글 목록 조회 시도');
        try {
            const result = await this.postsService.findAll(req.user);
            this.logger.log('게시글 목록 조회 성공');
            return result;
        }
        catch (error) {
            this.logger.error('게시글 목록 조회 실패', error.stack);
            throw error;
        }
    }
    async findOne(id, req) {
        this.logger.log(`게시글 상세 조회 시도: ${id}`);
        try {
            const result = await this.postsService.findOne(id, req.user);
            this.logger.log(`게시글 상세 조회 성공: ${id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`게시글 상세 조회 실패: ${id}`, error.stack);
            throw error;
        }
    }
    update(id, updatePostDto, req) {
        return this.postsService.update(id, updatePostDto, req.user);
    }
    remove(id, req) {
        return this.postsService.remove(id, req.user);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '게시글 작성' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '게시글 작성 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [posts_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '게시글 목록 조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '게시글 목록 조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '게시글 상세 조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '게시글 상세 조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '게시글 없음' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '게시글 수정' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '게시글 수정 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '권한 없음' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '게시글 없음' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, posts_dto_1.UpdatePostDto, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '게시글 삭제' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '게시글 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증 실패' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '권한 없음' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '게시글 없음' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "remove", null);
exports.PostsController = PostsController = PostsController_1 = __decorate([
    (0, swagger_1.ApiTags)('게시글'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map