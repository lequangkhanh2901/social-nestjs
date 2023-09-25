import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export default class UploadImagePipe implements PipeTransform {
  transform() {
    return true
  }
}
