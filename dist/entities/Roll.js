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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roll = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let Roll = class Roll extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Roll.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Roll.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], Roll.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], Roll.prototype, "deliveryType", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Date)
], Roll.prototype, "closingDate", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Roll.prototype, "creationDate", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Roll.prototype, "updateDate", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Roll.prototype, "pictureNumber", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Roll.prototype, "remainingPictures", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    typeorm_1.Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], Roll.prototype, "openingStatus", void 0);
Roll = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Roll);
exports.Roll = Roll;
//# sourceMappingURL=Roll.js.map