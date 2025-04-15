export class Course {
  constructor(
    public userId: number,
    public name: string,
    public courseImageUrl: string,
    public address: string,
    public distance: number,
    public duration: number,
    public id?: number,
    public isPublic?: boolean,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
