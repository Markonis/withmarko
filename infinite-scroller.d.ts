type CarouselOptions = {
    speed: number;
};
export declare class HorizontalCarousel {
    private options;
    private scroller;
    constructor(parent: HTMLElement, options: CarouselOptions);
    private start;
    private animate;
}
export {};
