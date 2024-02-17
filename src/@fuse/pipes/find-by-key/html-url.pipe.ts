import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'urlToHtml' })
export class UrlToHtmlPipe implements PipeTransform {
    transform(value: string): string {
        value = value.replace(/(?:\r\n|\r|\n)/g, '<br>')
        const reg = /(?:^|[^"'])(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
        const urls = value.match(reg);
        if (urls) {
            urls.forEach((url) => {
                const anchorTag = `<a href="${url}" target="_blank" class="linkDesign">${url}</a>`;
                value = value.replace(url, anchorTag);
            });
        }
        return value;
    }
}
