import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer, OnDestroy } from '@angular/core';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';

@Component({
  selector: 'gm-embedded-entry',
  styles: [require('./video-entry.css')],
  template: `
    <div class="video-wrapper">
      <div class="loader" #loader></div>
      <iframe #iframe
        *ngIf="url"
        [src]="url"
        frameborder="0" 
        webkitallowfullscreen="" 
        mozallowfullscreen="" 
        allowfullscreen="">
      </iframe>
    </div>
  `
})
export class EmbeddedEntryComponent implements OnInit, AfterViewInit, OnDestroy {
  protected url: SafeResourceUrl;
  @ViewChild('iframe') private iframeElementRef: ElementRef;
  @ViewChild('loader') private loaderElementRef: ElementRef;
  @Input() private entry: any;

  private sanitationService: DomSanitizationService;
  private renderer: Renderer;
  private elementRef: ElementRef;
  private listenLoad: any;

  public constructor(sanitationService: DomSanitizationService,
                     renderer: Renderer,
                     elementRef: ElementRef) {
    this.sanitationService = sanitationService;
    this.renderer = renderer;
    this.elementRef = elementRef;
  }

  public ngAfterViewInit(): any {
    this.hideIframe();
    this.listenLoad = this.renderer.listen(this.iframeElementRef.nativeElement, 'load', () => {
      this.showIframe();
    });
  }

  public hideIframe(): void {
    this.setStyles('hidden', 'block');
  }

  public showIframe(): void {
    this.setStyles('visible', 'none');
  }

  public setStyles(iframeStyles: string, loaderStyles: string): void {
    this.renderer.setElementStyle(this.iframeElementRef.nativeElement, 'visibility', iframeStyles);
    this.renderer.setElementStyle(this.loaderElementRef.nativeElement, 'display', loaderStyles);
  }

  public ngOnInit(): void {
    if (this.entry.fields.link) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.link);
    }
  }

  public ngOnDestroy(): any {
    this.listenLoad();
  }

}
