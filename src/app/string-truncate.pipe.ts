import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringTruncate'
})
export class StringTruncatePipe implements PipeTransform {

  transform(value: string, completeWords?: boolean, ellipsis?: string):string {
    let limit:number;
    // Getting screen width to appropriately set the character limit.
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    if(vw < 420) // Mobile
      limit = 21;
    else if(vw > 420 && vw < 769) // Table
      limit = 10;
    else limit = 15; // Desktop
    console.log("limit is: ", limit);
    completeWords = (typeof completeWords === 'undefined') ? false : completeWords;
    ellipsis = (typeof ellipsis === 'undefined') ? '...' : ellipsis;
    if(completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }

}
