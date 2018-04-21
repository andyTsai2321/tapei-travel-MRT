/**
 * 取得景點資料
 * 透過AJAX取得JSON資料
 */
var xhr = new XMLHttpRequest();
xhr.open('get', 'data/travel.json', true);
xhr.send(null);
xhr.onload = function() {

    dataResult = JSON.parse(xhr.responseText);

    // 整理出所有站名
    let areaList = [];
    for (let i = 0; dataResult.length > i; i++) {
        areaList.push(dataResult[i].MRT);
    }
    console.log(areaList);

    // 再用 foreach 去判斷陣列裡面所有值是否有吻合
    let area = [];
    areaList.forEach(function(value) {
        if (area.indexOf(value) == -1) {
            area.push(value);
            // area.remove('null');
        }
    });
    console.log(areaList);
    console.log(area);

    // 排序
    area.sort();
    // 刪掉站名null
    area.splice(0, 1);

    areaUpdated(area);
    AR.addEventListener('change', updatedList);
    hotAR.addEventListener('click', hotarea);
}

let AR = document.querySelector('#ARId');
let hotAR = document.querySelector('#hotARList');
let listTitle = document.querySelector('#listTitle');
let list = document.querySelector('#list');
let detail = document.querySelector('#detail');
let noDataText = '未提供'; //無資料時顯示的文字


//行政區下拉選單
function areaUpdated(items) {
    let str = '<option value="none">-- 請選擇捷運站 --</option>';
    for (let i = 0; i < items.length; i++) {
        str += '<option data-number="' + i + '" value="' + items[i] + '">' + items[i] + '</option>'
    }
    AR.innerHTML = str;
}

function hotarea(e) {
    updatedList(e);
}
//切割array中連在一起的網址
function sliceUrl(str) {
    var index = 0,
        arr = [];
    str.replace(/(\.jpg|\.JPG|\.png|\.PNG)/g, (match, p1, i, p3, offset, string) => {
        arr.push(str.substring(index, i + match.length));
        index = i + match.length;
    })
    return arr
}

//同步更新網頁
function updatedList(e) {
    let str = '';
    for (let i = 0; i < dataResult.length; i++) {
        //捷運站名 等於 使用者點擊的捷運站名 撈出那個捷運站所有景點 並塞入html中
        if (dataResult[i].MRT == e.target.value) {
            var dataTitle = dataResult[i].stitle || noDataText;
            var dataOpenTime = dataResult[i].MEMO_TIME || noDataText;
            var dataAddress = dataResult[i].address || noDataText;
            listTitle.textContent = dataResult[i].MRT;
            str += `
                <li class="list-box" data-detail="${dataTitle}">
                    <div class="list-img " style="background:url(${sliceUrl(dataResult[i].file)[0]});background-size: cover;background-position: center; ">
                        <div class="list-box-titleWrap">
                            <div class="list-box-title">
                            <h3>${dataTitle}</h3>
                            <h2>${dataResult[i].CAT2}</h2>
                            </div>
                        </div>
                    </div>
                    <ul>
                        <li>
                            <i class="fas fa-clock"></i><div class="list-li-detail">${dataOpenTime}</div>
                        </li>
                        <li>
                            <i class="fas fa-map-marker-alt"></i><div class="list-li-detail">${dataAddress}</div>
                        </li>
                    </ul>
                </li>
            `
        }
        list.innerHTML = str;
    }
    //詳細資料彈出視窗
    $(document).on('click', '.list-box', function(event) {
        var myid = $(this).data('detail');
        let popup = '';
        for (let i = 0; dataResult.length > i; i++) {
            if (dataResult[i].stitle == myid) {
                var dataTitle = dataResult[i].stitle || noDataText;
                var dataDesc = dataResult[i].xbody || noDataText;
                var dataInfo = dataResult[i].info || noDataText;
                var dataOpenTime = dataResult[i].MEMO_TIME || noDataText;
                var dataAddress = dataResult[i].address || noDataText;
                popup += `
                            <div class="modal-wrapper">
                              <div class="modal">
                                <div class="modal-head">
                                    <div class="modal-title">${dataTitle}</div>
                                </div>
                                <a class="btn-close"></a>
                                <div id="carousel"class="carousel slide carousel-fade"data-ride="carousel">
                                   <ol id="carousel-ol" class="carousel-indicators">
                                   </ol>
                                   <div id="images-box" class="carousel-inner">
                                      
                                   </div>
                                   <a class="carousel-control left"href="#carousel"data-slide="prev"><i class="fas fa-chevron-left"></i></a><a class="carousel-control right"href="#carousel"data-slide="next"><i class="fas fa-chevron-right"></i></a>
                                </div>
                                <div class="modal-content">
                                    <div class="modal-content-block">
                                        <div class="content-description">
                                            ${dataDesc}
                                        </div>
                                    </div>
                                    <div class="modal-content-block">
                                        <ul>
                                            <li><i class="fas fa-clock"></i><span class="modal-content-li">${dataOpenTime}</span></li>
                                            <li><i class="fas fa-map-marker-alt"></i><span class="modal-content-li">${dataAddress}</span></li>
                                            <li><i class="fas fa-subway"></i><span class="modal-content-li">${dataInfo}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                          </div>
                    `
            }
        }
        detail.innerHTML = popup;

        //景點輪播圖
        for (let i = 0; dataResult.length > i; i++) {
            let arrUrls = sliceUrl(dataResult[i].file);
            if (dataResult[i].stitle == myid) {
                let hImg = null;
                arrUrls.forEach((u) => {
                    var item = document.createElement('div');
                    hImg = document.createElement('img');
                    item.className = 'item';
                    hImg.className = 'image-co';
                    hImg.src = u;
                    item.appendChild(hImg);
                    document.getElementById('images-box').appendChild(item);
                    $('#images-box > div').first().addClass('active');
                });

                //產生輪播圖 圈圈
                for (let i = 0; arrUrls.length > i; i++) {
                    var hImgOl = document.createElement('li');
                    hImgOl.dataset.target = "#carousel";
                    document.getElementById('carousel-ol').appendChild(hImgOl);
                    $('#carousel-ol > li').first().addClass('active');
                }
            }

        }
        $('.modal-wrapper').addClass('open');
        $('.container').addClass('blur');
        // return false;
        // 彈出視窗關閉按鈕
        $(document).on('click', '.btn-close', function(e) {
            $('.modal-wrapper').removeClass('open');
            $('.container').removeClass('blur');
        });
    });
}

//記錄點及次數 篩選前四名放進熱門
//搜尋功能
//捷運站依線路分類
//google api