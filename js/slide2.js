(function($){  // 매개변수(파라미터 Parameter)
    // 즉시표현함수는 제이쿼리 달러 사인기호의 
    // 외부 플러그인(라이브러리)와 충돌을 피하기 위해 사용하는 함수식

    // 객체(Object 오브젝트) 선언 {} : 섹션별 변수 중복을 피할 수 있다.
    // const obj = new Object(); // 객체 생성자 방식
    //       obj = {}  

    const obj = {  // 객체 리터럴 방식 권장
        init(){  // 대표 메서드
            this.header();
            this.section1();
            this.section2();
            this.section3();
        },
        header(){},
        section1(){
            let cnt=0;
            let setId=0;
            let winW = $(window).innerWidth();
            const slideContainer = $('#section1 .slide-container');
            const slideWrap = $('#section1 .slide-wrap');
            const slideView = $('#section1 .slide-view');
            const slideImg = $('#section1 .slide img');
            const pageBtn = $('#section1 .page-btn');
            const stopBtn = $('#section1 .stop-btn');
            const playBtn = $('#section1 .play-btn');
            const n = ($('#section1 .slide').length-2)-1;
            const ImgRate = 1.3452443510246979;   //slideImg.innerWidth()/winWi;
            const ImgTranRate = 1.1255625; //이미 크기별 -translateX값  
            let x =(ImgRate * winW) * ImgTranRate;
            //console.log('슬라이드 이미지 너비='+slideImg.innerWidth());
            //console.log('슬라이드 이미지 비율='+ImgRate);

            //이미지 반응형 => 비율계산
            //이미지 비율 = 이미지너비 2500
            //                      =>2500/1903=1.31371
            //현재 윈도우 너비 =#(window).innerWidth();
            //                =>2500/1903

            //창크기 반응하는 이미지크기와 트랜스레이트x
            //크기가 1픽셀만 변경되도 즉각 반응
            $(window).resize(function(){
                winW = $(window).innerWidth();
                x =(ImgRate * winW) * ImgTranRate;
                slideImg.css({width: ImgRate*winW, transoform:`translateX($(-x)px)`});
            });

            //이미지 크기 조절
            slideImg.css({width: ImgRate*winW, transoform:`translateX($(-x)px)`});

            // 0. 메인슬라이드 터치스와이프
            
            let mouseDown = null;
            let mouseUp = null;

            //드래그 시작과 끝
            let dragStart = null;
            let dragEnd =null; 
            let mDown = false;
            let sizeX = winW / 2;
            

            // 터치 스와이프 이벤트
            slideContainer.on({ 
                mousedown(e){
                    mouseDown = e.clientX;
                    dragStart = e.clientX-(slideWrap.offset().left+winW)
                    mDown = true;
                    winW = $(window).innerWidth();
                    sizeX = winW / 2 ;
                    slideView.css({cursor:'grabbing'});                 
                },
                mouseup(e){
                    mouseUp = e.clientX;        
                    
                    if( mouseDown-mouseUp > sizeX ){
                        clearInterval(setId); 
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){
                        clearInterval(setId); 
                        if(!slideWrap.is(':animated')){
                            prevCount();

                        }                            
                    }
                    if(  mouseDown-mouseUp >= -sizeX  &&  mouseDown-mouseUp <= sizeX ){
                        mainSlide();
                    }
                    mDown = false;
                    slideView.css({cursor:'grab'});


                },
                mousemove(e){
                    dragEnd = e.clientX;
                    if(!mDown){return;} 
                    slideWrap.css({left: dragEnd-dragStart});
                }
            })

            $(document).on({
                
                mouseup(e){
                    if(!mDown){return;}
                    mouseUp = e.clientX;        
                    
                    if( mouseDown-mouseUp > sizeX ){
                        clearInterval(setId); 
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){
                        clearInterval(setId); 
                        if(!slideWrap.is(':animated')){
                            prevCount();

                        }                            
                    }
                    if(  mouseDown-mouseUp >= -sizeX  &&  mouseDown-mouseUp <= sizeX ){
                        mainSlide();
                    }
                    mDown = false;
                    slideView.css({cursor:'grab'});


                },

            });




            // 1. 메인슬라이드함수
            function mainSlide(){
                slideWrap.stop().animate({left: `${-100*cnt}%`}, 600, 'easeInOutExpo', function(){
                    if(cnt>n){cnt=0}
                    if(cnt<0){cnt=n}
                    slideWrap.stop().animate({left: `${-100*cnt}%`}, 0);
                });
                pageEvent();
            }

            // 2-1. 다음카운트함수
            function nextCount(){
                cnt++;
                mainSlide();
            }
            // 2-2. 이전카운트함수
            function prevCount(){
                cnt--;
                mainSlide();
            }

            // 3. 자동타이머함수(7초 후 7초간격 계속)
            function autoTimer(){
                setId = setInterval(nextCount, 7000);
            }
            autoTimer();

            // 4. 페이지 이벤트 함수
            function pageEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq( cnt>n ? 0 : cnt).addClass('on');
            }

            // 5. 페이지버튼클릭
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainSlide();
                        clearInterval(setId); // 클릭시 일시중지
                    }
                });
            });

            // 6-1. 스톱 버튼 클릭이벤트
            stopBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.addClass('on');
                    playBtn.addClass('on');
                    clearInterval(setId); // 클릭시 일시중지
                }
            })

            // 6-2. 플레이 버튼 클릭이벤트
            playBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.removeClass('on');
                    playBtn.removeClass('on');
                    autoTimer(); // 클릭시 재실행 7초후실행
                }
            })

            
        },
        section2(){
            //  변수설정
            let cnt = 0;
                const slideContainer = $('#section2 .slide-container');
                const slideWrap = $('#section2 .slide-wrap');
                const slideView = $('#section2 .slide-view');
                const slide = $('#section2 .slide-view .slide');
                const slideH3 = $('#section2 .slide-view .slide h3');
                const slideH4 = $('#section2 .slide-view .slide h4');
                const pageBtn = $('#section2 .page-btn');
                const selectBtn = $('#section2 .select-btn');
                const subMenu = $('#section2 .sub-menu');
                const materialIcons = $('#section2  .select-btn .material-icons');
                const section2Container =$('#section2 .container');
                const heightRate = 0.884545392;
                let winW = $(window).innerWidth();
                let slideWidth;

                //console.log((section2Container.innerWidth()-198+20+20)/3);
                

                resizeFn(); // 로딩시
                //함수는 명령어의 묶음
                function resizeFn(){
                    winW = $(window).innerWidth(); // 창크기 계속 값을 보여준다.
                    // 창너비(window)가 1642 픽셀 이하에서 패딩 좌측 값 0으로 설정
                    if(winW <= 1642){ // 이하 winW <= 1642 
                        if(winW > 1280){ // 1280 초과 에서는 슬라이드 3개 
                            slideWidth = (section2Container.innerWidth()-0+20+20)/3; 
                        }
                        else{ // 1280 이하 에서는 슬라이드 1개
                            slideWidth = (section2Container.innerWidth()-0+20+20)/1; 
                        }                                          
                    }
                    else{ // 1642 초과(보다 크다)
                        slideWidth = (section2Container.innerWidth()-198+20+20)/3;
                    }                
                    slideWrap.css({width: slideWidth*10 });
                    slide.css({width: slideWidth, height: slideWidth*heightRate });
                    slideH3.css({fontSize: slideWidth*0.07 });
                    slideH4.css({fontSize: slideWidth*0.03 });
                    mainSlide(); // 슬라이드에 슬라이드 너비 전달하기위해서 호출
                }
                
                // 가로 세로 크기가 1픽셀만 이라도 변경되면 동작 구동(실행)이 된다.
                // 가로 세로 크기가 변경이 안되면 영원히 그대로 구동이 없다.
                $(window).resize(function(){
                    resizeFn();
                });


            //

            // 터치스와이프
            let touchStart = null;
            let touchEnd = null;

            //드래그 시작과 끝
            let dragStart = null;
            let dragEnd =null; 
            let mDown = false;
            let sizeX = 300;
            //console.log(slideWrap.offset().left-318);
            let offSetL = slideWrap.offset().left;
            //console.log( offSetL );


            slideContainer.on({
                mousedown(e){                    
                    mDown = true;
                    touchStart = e.clientX;
                    dragStart = e.clientX - (slideWrap.offset().left - offSetL);
                    slideView.css({ cursor: 'grabbing' });
                },
                mouseup(e){                                      
                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    if(  touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({cursor:'grab'});
                    mDown = false;
                },
                mousemove(e){
                    if( !mDown ) return;
                    dragEnd = e.clientX;
                    slideWrap.css({left: dragEnd - dragStart });

                }
            }); 

            // $(document).on({
            //     mouseup(e){
            //         if(!mDown){return;}
                    
            //         touchEnd = e.clientX;
            //         if(touchStart-touchEnd > sizeX){
            //             nextCount();
            //         }
            //         if(touchStart-touchEnd < -sizeX){
            //             prevCount();
            //         }
            //         if(  touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
            //             mainSlide();
            //         }
            //         slideView.css({cursor:'grab'});
            //         mDown = false;
            //     }
                

            // });   





            
            selectBtn.on({
                click(e){
                    e.preventDefault();
                    subMenu.toggleClass('on');  
                    materialIcons.toggleClass('on'); 
                }
            })


            //  메인슬라이드함수
            mainSlide();
            function mainSlide(){                
                slideWrap.stop().animate({left: -slideWidth * cnt }, 600, 'easeInOutExpo');                
                pageBtnEvent();
            }

            // 다음카운트함수
            function nextCount(){
                cnt++;
                if(cnt>7) {cnt=7};
                mainSlide();
            }

            // 이전카운트함수
            function prevCount(){
                cnt--
                if(cnt<0) {cnt=0};
                mainSlide();
            }


            //  페이지버튼 클릭이벤트
            
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        console.log(idx);
                        cnt=idx;
                        mainSlide();
                    }
                })
            });

            //  3. 페이지버튼 이벤트 함수
            function pageBtnEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq(cnt).addClass('on');
            }


        },
        section3(){},
    }
    obj.init();

})(jQuery); // 전달인수(아규먼트 Argument)
