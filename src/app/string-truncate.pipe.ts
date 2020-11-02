import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringTruncate'
})
export class StringTruncatePipe implements PipeTransform {

  transform(value: string, limit?: number, completeWords?: boolean, ellipsis?: string):string {
    limit = (typeof limit === 'undefined') ? 25 : limit;
    completeWords = (typeof completeWords === 'undefined') ? false : completeWords;
    ellipsis = (typeof ellipsis === 'undefined') ? '...' : ellipsis;
    if(completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }

}
