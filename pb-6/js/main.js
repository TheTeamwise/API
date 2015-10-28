var passCount = 1;
var baggage = {};
var baggageCount = baggageTotalLocal = baggageTotal = insuranceTotal = ticketsTotal = totalPrice =  0;
var tooltipElement, tipsyOne, tipsyTwo, tipsyThree;
var curScroll;
var citylist_name = [];
var citylist_id = [];
var citylistt = [];
var totalBaggageList = [];
var inputError = false;

var a = b = K = Z = P = [];

$(document).ready(function() {

  a = [document.querySelector('.left-inner'),document.querySelector('.checklist')];
  b = [null,null];
  K = [null,null];
  Z = [0,0];
  P = [0,0];
  
  window.addEventListener('scroll', function() {
    if($('.left-inner').is(':visible'))
      Ascroll('.plane-seats',0);
    if($('.checklist').is(':visible'))  
      Ascroll('.column-left',1);
  }, false);
  document.body.addEventListener('scroll', function() { 
    if($('.left-inner').is(':visible'))
      Ascroll('.plane-seats',0);
    if($('.checklist').is(':visible'))  
      Ascroll('.column-left',1);
  }, false);

  $(document).click(function(e){ 
    /*var elem = $(".airport"); 
    if(e.target!=elem[0]&&!elem.has(e.target).length){ elem.children('.citylist').hide(); }*/
    
    infobutton = $(".info-button"); 
    infotext = $(".info-text"); 
    if(e.target!=infotext[0]&&!infotext.has(e.target).length&&e.target!=infobutton[0]&&!infobutton.has(e.target).length){ infotext.hide(); } 
    
    addPassButton = $(".passenger .header .addPass-outer"); 
    addPassList = $(".passenger .header .list");
    if(e.target!=addPassList[1]&&!addPassList.has(e.target).length&&e.target!=addPassButton[1]&&!addPassButton.has(e.target).length){ addPassList.removeClass('active').hide(); } 
    
    addBaggageButton = $(".pax .baggage .list .add-outer"); 
    baggageList = $(".pax .baggage .list .addBaggage"); 
    if(e.target!=baggageList[1]&&!baggageList.has(e.target).length&&e.target!=addBaggageButton[1]&&!addBaggageButton.has(e.target).length){baggageList.removeClass('active').hide(); } 
  });
  
  /*$('form').submit(function() {
    $('.input-required.error').removeClass('error');
    inputError = false;
    
    $(this).find('.input-required').each(function() {
      input = $(this).find('input');
      inputVal = input.val();
      
      if(inputVal == '') {
        $(this).addClass('error');
        inputError = true;
      } else {
        numberVal = Number(inputVal.replace(/\D+/g,"")).toString();
        
        if(input.hasClass('cvv-code') && inputVal.length < 3) {
          $(this).addClass('error');
          inputError = true;
        } 
        if(input.hasClass('card-number') && (numberVal.length < 12 || numberVal.length > 19)) {
          $(this).addClass('error');
          inputError = true;
        }
        if(input.hasClass('phone') && inputVal.match(/[^0-9\(\)\+\- ]+/gi)) {
          $(this).addClass('error');
          inputError = true;
        }
      }
    });
    
    if(inputError) {
      $(window).scrollTop($('.input-required.error').eq(0).offset().top-10);
      return false;
    }
  });
  */
  
  /***********************************
  ** @ File: searchform.html
  ************************************/
  
  $('.passengers .counter .minus').click(function() {changePassengerCount(this,'minus')});
  $('.passengers .counter .plus').click(function() {changePassengerCount(this,'plus')});
  
  $('.direction input[type=radio]').change(function() {
    if($(this).attr('id') == 'direction-one')
      $('#date-back').fadeOut('fast');
    else
      $('#date-back').fadeIn('fast');
  });
  
  $('.airport .citylist span').click(function() {
    $th = $(this);
    dir = $th.parents('.citylist').attr('data-dir');
    
    citylist = $('.airport .citylist').attr('data-dir');
    id = $(this).attr('id').split('_')[1];
    
    if(dir == 'air-from' && id == $('#air-to').attr('data-cityid') || dir == 'air-to' && id == $('#air-from').attr('data-cityid'))
    {
      $('#'+dir+' .name').val($('.citylist span#city_'+$('#'+dir).attr('data-cityid')).text());
      
      if(dir == 'air-from')
        changeDirection();
      return false;
    }
    
    $('.citylist span.active').removeClass('active');
    $(this).addClass('active');
    
    $('#'+citylist+' .name').val($(this).html());
    $('#'+citylist+' .iata').html($(this).attr('data-iata'));
    
    $('#'+citylist+' input[type=hidden]').val(id);
    $('#'+citylist).attr('data-cityid',id);
    
    $('.citylist').hide();
  });
  
  $('.airport .change-direction').click(function() {
    changeDirection($(this));
  });
  
  if((!citylist_name[0] || !citylist_id[0]) && $('.searchform').is(':visible')) {
    $('.citylist .column span').each(function(i,v) {
      citylist_name.push($(v).html().toLowerCase());
      citylist_id.push($(v).attr('id'));
      citylistt[i] = {'id':$(v).attr('id'),'label':$(v).html().toLowerCase()};
    });
    
    $('input.name').autocompleter({ 
      source: citylistt,
      minLength: 1,
      hint: true
    });
  }
  
  $('.airport input.name').keyup(function(e) {    
    id = searchArray(citylist_name,$(this).val());
    obj = $('.citylist .column span#'+citylist_id[id]);
    
    $('.citylist .column span.hover').removeClass('hover');
    
    if($(this).val() == '' || id < 0) {
      if(e.keyCode == 13) {
        $(this).val($('.citylist .column span#city_'+$(this).siblings('input[type=hidden]').val()).text())
      }
      return false;
    }

    obj.addClass('hover');
    
    if(e.keyCode == 13) {
      obj.click();
      $('.citylist').hide();
      $(this).blur();
      obj.removeClass('hover');
    }
  });

  $('.searchform .citylist, .searchform .city').mousedown(function(e) {
    var target = e.target || e.srcElement;
    if (!target)
        return;
        
    if (!$(target).hasClass('.citylist')) {
      if (e.preventDefault)
        e.preventDefault();
      else
        return false;
    }
  });
  
  $('.city .name').focus(function() {
    $('.citylist .column span.hover').removeClass('hover');
    showCityList($(this).parent());
  });
  
  $('.city .name').blur(function() {
    res = $('.citylist span.hover');
    if(res.is(':visible'))
      res.click();
    else
      $(this).val($('.citylist span#city_'+$(this).parent().attr('data-cityid')).text());

    $('.citylist').hide();
    $('.autocompleter-hint').empty().removeClass('autocompleter-hint-show');
  });
  
  $('.searchform .city').click(function() {
    fname = $(this).find('.name');
    fname.focus();
    
    setTimeout(function() { fname.select(); }, 100);
  });
  
  /***********************************
  ** @ File: payment.html
  ************************************/
  
  $('.payment .pay .element').click(function() {
    $th = $(this);
    radio = $(this).find('.check input');
    
    $('.payment .pay .element.selected').removeClass('selected')
    
    if(radio.is(':checked')) {
      $th.removeClass('selected');
      radio.prop("checked", false);
    }
    else {
      $th.addClass('selected');
      radio.prop("checked", true);
    }
  });
  
  $('.payment-card input.cardholder').keyup(function() {
    reg = /[^a-zA-Z- ]+/gi;
    
    if($(this).val().match(reg)){
      $(this).val($(this).val().replace(reg,''));
      return false;
    }
  });
  

  /***********************************
  ** @ File: select.html
  ************************************/
  
  $('.select').ready(function() {
    //calculateTicketsTotalPrice();
    //calculateTotalPrice();
  });
  
  $('.select .tickets .ticket').click(function() {
    $th = $(this);
    radio = $(this).find('.radio input');
    
    if($th.hasClass('selected') || $th.hasClass('noticket'))
      return false;

    if($th.parent().find('.ticket.selected .line').eq(1).is(':visible'))
      $th.parent().find('.ticket.selected .line:eq(0) .to').html($th.parent().find('.ticket.selected .line:eq(1) .to').html())
    
    $th.parent().find('.ticket.selected .tw .code').animate({'margin-top':'1px'},200);
    $th.parent().find('.ticket.selected .union .in').slideUp(100);
    $th.parent().find('.ticket.selected .time, .ticket.selected .price').animate({'padding-top':'0px'},200);
    $th.parent().find('.ticket.selected .line .hide').slideUp(200);
    $th.parent().find('.ticket.selected').removeClass('selected');

    $th.parent().find('.ticket.first').removeClass('first');
    $th.parent().find('.ticket.twoplane').removeClass('twoplane');
    
    if(radio.is(':checked')) {
      $th.removeClass('selected');
      radio.prop("checked", false);
      
      if($th.find('.line.tw').is(':visible')) {
        $th.find('.tw .code').animate({'margin-top':'1px'},200);
        $th.find('.union .in').slideUp(100);
        $th.find('.time, .price').animate({'padding-top':'0px'},200);
      }
    }
    else {
      $th.addClass('selected');
      radio.prop("checked", true);
     
      if($th.find('.line.tw').is(':visible')) {
        $th.find('.tw .code').animate({'margin-top':'22px'},200);
        $th.find('.union .in').slideDown(100);
        $th.find('.time, .price').animate({'padding-top':'25px'},200);
        
        $th.find('.line .to').eq(0).html($th.find('.line:eq(1) .click div').html())
      }
    }

    if($th.find('.line.tw').is(':visible')) 
      $th.find('.line .hide').slideToggle(200);

    calculateTicketsTotalPrice();
    calculateTotalPrice();
  });
  
  $('.select .calendar').click(function() {

    full = $(this).siblings('.dates.full');
    week = $(this).siblings('.dates.week');
    
    if(full.is(':visible')) {
      week.find('.date.active').removeClass('active');
      week.find('.date').each(function() {
        if($(this).attr('data-date') == full.find('.date.active').attr('data-date'))
          $(this).addClass('active');
      });
      full.hide();
      week.show();
    } else {
      full.find('.date.active').removeClass('active');
      full.find('.date').each(function() {
        if($(this).attr('data-date') == week.find('.date.active').attr('data-date'))
          $(this).addClass('active');
      });
      full.show();
      week.hide();
    }
  });
  
  $('.select .dates .date:not(.disabled,.empty)').click(function() {
    $th = $(this)
    
    $th.parents('.dates').find('.date.active').removeClass('active');
    $th.addClass('active');
  });
  
  

  /***********************************
  ** @ File: pax.html
  ************************************/
  
  $('#pax-form').submit(function() {
    if(baggageTotal < 1 && !inputError) {
      openModalBox('without-baggage');
      return false;
    }
  });
  $('.pax-continue').click(function() {
    baggageTotal = 1;
    $('#pax-form').submit();
  });
  
  $('.pax .addpassenger').click(function() {
    list = $(this).siblings('.list');
    
    if(list.is(':visible'))
      list.removeClass('active').hide();
    else {
      $('.pax .passenger .list').removeClass('active').hide();
      list.addClass('active').show();
    }
    
    //$(this).siblings('.list').toggle();
  });
  $('.pax .info-button').click(function() {
    $(this).siblings('.info-text').toggle();
  });
  $('.pax .header > .arrow').click(function() {
    $th = $(this)
    body = $th.parents('.passenger').find('.body');
    
    if(body.is(':visible'))
      $th.addClass('close');
    else
      $th.removeClass('close');
    
    body.slideToggle();
    return false;
  });
  
  $('.pax .passenger input,.pax .passenger select').focus(function() {
    $('.pax .passenger.blue').removeClass('blue');
    $(this).parents('.passenger').addClass('blue');
    $(this).parents('.passenger').find('.body').slideDown();
    $(this).parents('.header > .arrow').removeClass('close');
  });
  $('.pax .passenger').click(function() {
    $('.pax .passenger.blue').removeClass('blue');
    $(this).addClass('blue');
    $(this).find('.body').slideDown();
    $(this).find('.header > .arrow').removeClass('close');
  });
  
  $('.pax .passenger input[name=firstname], .pax .passenger input[name=lastname]').keyup(function() {
    reg = /[^Ё-ёА-Яа-яa-zA-Z- ]+/gi;
    
    parent = $(this).parents('.passenger');
    
    lastname = parent.find('input[name=lastname]').val();
    firstname = parent.find('input[name=firstname]').val();
    
    text = (lastname?lastname:'')+' '+(firstname?firstname:'');
    
    if(lastname.match(reg)){
      parent.find('input[name=lastname]').val(lastname.replace(reg,''));
      return false;
    }
    if(firstname.match(reg)){
      parent.find('input[name=firstname]').val(firstname.replace(reg,''));
      return false
    }
      
    if(lastname == '' && firstname == '')
      parent.find('.header > h3 span.start').show();
    else
      parent.find('.header > h3 span.start').hide();
      
    parent.find('.header > h3 span.new').html(text);
  });
  
  $('.pax .addBaggage .counter .minus').click(function() {changeBaggageCount(this,'minus')});
  $('.pax .addBaggage .counter .plus').click(function() {changeBaggageCount(this,'plus')});
  
  $('.pax .addBaggage #countBaggage').click(function() { buildBaggageList($(this)); return false; });
  
  $('.pax .info-section .list .element.add').click(function() {
    bag = $(this).siblings('.addBaggage');
    
    if(bag.is(':visible'))
      bag.removeClass('active').hide();
    else {
      $('.pax .info-section .list .addBaggage.active').removeClass('active').hide();
      bag.addClass('active').show();
      $(window).scrollTop(bag.offset().top);
      Ascroll('.column-left',1);
    }
  });
  
  /*$('.pax .info-section .addBaggage').on('click','.radio label',function() {
    $th = $(this)
    input = $th.siblings('input');
    parent = input.parents('.section');

    if(input.is(':checked')){
      input.prop('checked',false);
      
      parent.find('input.clicked').removeClass('clicked');
      parent.find('input[type=checkbox]:disabled').prop('disabled',false);
      
      return false;
    } else if(!input.is(':disabled')) {
      parent.find('input.clicked').removeClass('clicked');
      input.addClass('clicked');
      
      parent.find('input[type=checkbox]:not(.clicked)').prop('disabled',true);
    }
  });*/
  
  $('.pax .info-section .list .inner').on('click','.element .button.delete', function() {
    $th = $(this);
    parent = $th.parents('.list');
    el = $th.parent();
    count = el.attr('data-count')-1;
    
    parent.find('.addBaggage #'+el.attr('data-id')).find('.count').html(count<0?0:count);
    parent.find('.addBaggage #'+el.attr('data-id')).find('input').prop('checked',false);
    parent.find('.addBaggage #'+el.attr('data-id')).find('input.null').prop('checked',true);
    
    if(count < 1) {
      if(!parent.find('.inner .element').eq(1).is(':visible'))
        $th.parents('.info-section').siblings('.info-section.back').find('.same').hide();
        
      el.remove();
      parent.find('.addBaggage #'+el.attr('data-id')).find('.minus').css('opacity','0.3');
    }
    
    buildBaggageList(parent.find('#countBaggage'));
  });
  
  $('.pax .column-left .insurance .line input').change(function() {
    $th = $(this);
    
    if($th.attr('id') == 'insurance-1' && $th.is(':checked'))
      $('.pax .column-left .insurance .line input').prop('checked',true);
    
    calculateInsuranceTotalPrice();
  });
  
  $('.pax .passenger .list .element').click(function() {
    $th = $(this);
    json = JSON.parse($th.attr('data-info'));
    parrent = $th.parents('.passenger');
    
    title = json['lastname']+' '+json['firstname'];
    parrent.find('h3 .start').hide();
    parrent.find('h3 .new').html(title.substr(0,25)+(title.length>25?'...':''));
    
    for(key in json) {
      input = parrent.find('#'+key)
      if(key == 'birthday') {
        date = new Date(json[key].toString().replace(/(\d+).(\d+).(\d+)/, '$2/$1/$3'));
        parrent.find('.bday option[value='+date.getDate()+']').attr('selected','selected').trigger('liszt:updated');
        parrent.find('.bmonth option[value='+(date.getMonth()+1)+']').attr('selected','selected').trigger('liszt:updated');
        parrent.find('.byear option[value='+date.getFullYear()+']').attr('selected','selected').trigger('liszt:updated');
      } else if(key == 'document' || key == 'citizenship') {
        parrent.find('.'+key+' option[value='+json[key]+']').attr('selected','selected').trigger('liszt:updated');
      } else if(key == 'gender')
        parrent.find('.gender .radio input[value='+json[key]+']').prop('checked',true)
      else
        input.val(json[key]);
    }
      
    $th.parent().hide();
  });
  
  $('.addBaggage .baggage-salon input[type=radio]').change(function() {
    if($(this).prop('checked')) {
      $(this).parents('.section').find('.count').html('0');
      $(this).parents('.section').find('.minus').css('opacity','0.3');
    }
  });
  
  $('.pax #babycompany').change(function() {
    ticketTotal = [];
    ticketTotal['from'] = ticketTotal['back'] = 0;
    
    if($(this).prop('checked'))
      $('.checklist .child-company').removeClass('hide');
    else
      $('.checklist .child-company').addClass('hide');
      
    $('.checklist .tickets-price .list > div:not(.hide) .right span').each(function() {
      if($(this).parents('.direction').hasClass('from'))
        ticketTotal['from'] += Number($(this).text().replace(/\D+/g,""));
      else
        ticketTotal['back'] += Number($(this).text().replace(/\D+/g,""));
    });
    
    $('.checklist .direction.from .tickets-price .total .right span').html(ticketTotal['from'].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    $('.checklist .direction.back .tickets-price .total .right span').html(ticketTotal['back'].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  });


  /***********************************
  ** @ File: seats.html
  ************************************/
  
  $('.seats .passenger').click(function() {
    if($(this).hasClass('.selected'))
      return false;
      
    place = $(this).find('.place span').text();
    place = (place?place:$(this).find('.place').attr('data-free'))
    
    $('.seats .passenger.selected').removeClass('selected');
    $(this).addClass('selected');
    
    $('.plane-seats .seat-icon#'+place).addClass('selected');
    
    buildSeatsList();
  });
  
  $('.seats .plane-seats').on('click','.seat-icon:not(.long,.selected,.companion,.busy)',function() {
    freePlace = $('.seats .passenger.selected .place').attr('data-free');
    newPlace = $(this).attr('id');
    passenger = $('.seats .passenger.selected');
    nextPassenger = passenger.next();
    nextDirection = passenger.parents('.section').next().find('.passenger');
    
    $('.plane-seats .seat-icon.selected').removeAttr('data-name').removeClass('selected');
    $(this)
      .attr('data-name',$('.seats .passenger.selected .name').text())
      .attr('data-free',$('.seats .passenger.selected .place').attr('data-free'));
    
    if(newPlace == freePlace) {
      passenger.removeClass('paySeats');
    } else {
      passenger.addClass('paySeats');
    }
      
    passenger.find('input').val(newPlace);
    passenger.find('.place span').html(newPlace);
    
    if(nextPassenger.is(':visible')) {
      nextPassenger.addClass('selected');
      passenger.removeClass('selected');
    } else if(nextDirection.is(':visible'))
    {
      nextDirection.first().addClass('selected');
      passenger.removeClass('selected');
    }

    if($(this).parent().hasClass('long')) {
      $(this).parents('.seat').find('.seats-hover .text').html('<strong>Внимание!</strong><br />Место у аварийного выхода невозможно выбрать для пассажира младше 18 лет и пассажиров с ограниченными возможностями.');
      $(this).parents('.seat').find('.seats-hover').css('top',(0-parseInt($(this).parents('.seat').find('.seats-hover').outerHeight())));
    } else
      $('.seats .plane-seats .seats-hover').remove();
    buildSeatsList();
  });
  
  $('.seats .passenger .delPay').click(function() {
    $th = $(this);
    place = $th.parents('.place');
    
    $th.siblings('span').html(place.attr('data-free'));
    place.siblings('input').val(place.attr('data-free'));
    
    $th.parents('.passenger').removeClass('paySeats');
    $('.plane-seats .seat-icon.selected').removeClass('selected');
    $('.plane-seats .seat-icon#'+place.attr('data-free')).addClass('selected');

    $('.seats .plane-seats .seats-hover').remove();
  }); 
  
  $('.seats .plane-seats').ready(function() { 
    buildSeatsList();
  });
  
  $('.seats .plane-seats .seat').hover(function() {
    seatsHover($(this));
  }, function() {
    $th.find('.seats-hover').remove();
  });
  
  $('.seats .plane-seats .seat').on('click','.seats-hover button.cancel', function() {
    $th = $(this).parents('.seat').find('.seat-icon').not('.long');
    freePlace = $('.seats .plane-seats .seat .seat-icon#'+$th.attr('data-free'));

    passenger = $('.seats .passenger .place[data-free='+$th.attr('data-free')+']');
    passenger.find('span').html($th.attr('data-free'));
    passenger.parents('.passenger').removeClass('paySeats');
    passenger.parents('.passenger').find('input').val($th.attr('data-free'));
    
    if($th.hasClass('selected'))
      cclass = 'selected';
    else
      cclass = 'companion';
    
    freePlace.attr('data-name',$th.attr('data-name')).addClass(cclass);
    $th.removeClass(cclass).removeAttr('data-free').removeAttr('data-name');
    
    $th.parents('.seat').find('.seats-hover').remove();
  });
  
  $('.modalbox .bg,.modalbox .close-button').click(function() { 
    $('.modalbox, .modalbox .window').hide();
    $('html,body').css('overflow','auto');
  });
  
  
  /***********************************
  ** @ File: personal-profile.html
  ************************************/
  
  $('#addDocument').click(function() {
    $('.personal-profile .column.float-right').eq(0).append(
                '<div class="line">'+
                  '<div class="title"><span>Серия и номер:</span></div>'+
                  '<input type="text" name="doc_number[]" class="input-text"/>'+
                '</div>');
    $('.personal-profile .column.float-left').eq(0).append(
                '<div class="line">'+
                  '<div class="title"><span>Документ:</span></div>'+
                  '<select name="citizenship[]" class="input-text" id="'+Math.random()+'">'+
                    $('.personal-profile .column.float-left .line.document-select select').html()+
                  '</select>'+
                '</div>');
    $('select').on('liszt:ready', function(e, chosen) {
      $('.chzn-results').jScrollPane({showArrows: false});
      setTimeout(function() { $('.willhide').hide()},100);
    }).chosen();
  });
  
  $('.checklist .arrow,.baggage-passenger .header .arrow').click(function() {
    sub = $(this).parent().siblings('.sub');
    sub.slideToggle(function() {
      if(sub.is(':visible'))
        sub.parent().addClass('open');
      else
        sub.parent().removeClass('open');
    });
  })
});


/************************************/

searchArray = function(a,s) {
  for( var i = 0; i < a.length; ++i )
      if( a[i].match(new RegExp('^'+s,'i')))
        return i;
  for( var i = 0; i < a.length; ++i )
      if( a[i].match(new RegExp(s,'i')))
        return i;      
    return -1;
}

showCityList = function(obj) {
  $th = obj;
  arrow = $('.citylist .arrow');
  citylist = $('.citylist');
  
  if($th.attr('id') == 'air-to')
    arrow.addClass('right');
  else
    arrow.removeClass('right');
    
  citylist.attr('data-dir',$th.attr('id'));
  
  $('.citylist span.active').removeClass('active');
  $('#city_'+$th.attr('data-cityid')).addClass('active');
  
  citylist.show();
}

seatsHover = function(obj) {
  $th = obj;
  el = '';

  $('.seats .plane-seats .seats-hover').remove();
  
  section = $th.parents('.section');
  icon = $th.find('.seat-icon').not('.long');

  if(icon.hasClass('companion') || icon.hasClass('selected')) {
    html = '<strong>'+icon.attr('data-name')+'</strong>';
    if(icon.attr('data-free'))
      html += '<div class="bottom"><button class="btn tr small cancel">отменить выбор места</button></div>';
    
    el = 'pass';
  }else if(section.hasClass('fast'))
    html = '<strong>Хотите быстрее?</strong><br />Пассажиры передней<br /> части салона быстрее<br /> покидают самолет';
  else if(section.hasClass('comfort'))
    html ='<strong>Хотите больше комфорта?</strong><br />Выберите место<br /> с увеличенным<br /> пространством для ног';
  else 
    return false;
    
  $th.append('<div class="seats-hover '+el+'"><div class="inner"><div class="text">'+html+'</div><div class="arrow"></div></div></div>');
  $th.find('.seats-hover').css('top',(0-parseInt($th.find('.seats-hover').outerHeight())));
}

openModalBox = function(el) {
  $('.modalbox,#'+el).show();
  $('html,body').css('overflow','hidden');
}

changeDirection = function(obj) {
  info_from = info_to = [];
    
  info_from = [$('.airport #air-from').attr('data-cityid'),''+$('.airport #air-from .name').val()+'',''+$('.airport #air-from .iata').html()+''];
  info_to = [$('.airport #air-to').attr('data-cityid'),''+$('.airport #air-to .name').val()+'',''+$('.airport #air-to .iata').html()+''];

  $('.airport #air-from').attr('data-cityid',info_to[0]);
  $('.airport #air-from .name').val(info_to[1]);
  $('.airport #air-from .iata').html(info_to[2]);
  $('.airport #air-from input[type=hidden]').val(info_to[0]);
  
  $('.airport #air-to').attr('data-cityid',info_from[0]);
  $('.airport #air-to .name').val(info_from[1]);
  $('.airport #air-to .iata').html(info_from[2]);
  $('.airport #air-to input[type=hidden]').val(info_from[0]);
  
  $('.citylist').hide();
}

buildSeatsList = function() {
  $th = $('.seats .passenger.selected');
  
  $('.plane-seats .seat-icon.companion').removeClass('companion');
  $('.plane-seats .seat-icon.selected').removeClass('selected');
  
  $th.parent().find('.passenger').each(function() {
    place = $(this).find('.place span').text();
    place = (place?place:$(this).find('.place').attr('data-free'))
    
    if($(this).hasClass('selected')) {
      //alert();
      $('.plane-seats .seat-icon#'+place).addClass('selected').attr('data-name',$(this).find('.name').text());;
    } else
      $('.plane-seats .seat-icon#'+place).addClass('companion').attr('data-name',$(this).find('.name').text());
  });
  
  busySeats = JSON.parse($th.siblings('input').val());

  $('.plane-seats .seat-icon.busy')
  .removeClass('busy')
  .removeClass('male')
  .removeClass('female')
  
  for(key in busySeats){ 
    $('.plane-seats .seat-icon#'+key).addClass(busySeats[key]);
  }
} 

calculateTicketsTotalPrice = function() {
  ticketsTotal = [];
  ticketsTotal['total_from'] = ticketsTotal['total_back'] = ticketsTotal['back'] = ticketsTotal['from'] = 0;
  
  $('.ticket.selected .price span').each(function() {
    if($(this).parents('.tickets-section').hasClass('from'))
      ticketsTotal['from'] = Number($(this).text().replace(/\D+/g,""));
    else 
      ticketsTotal['back'] = Number($(this).text().replace(/\D+/g,""));  
  });
  
  $('.column-right .tickets-price .list .right span').each(function() {
    count = parseInt($(this).parent().siblings('.left').text());
    
    if($(this).parents('.direction').hasClass('from')) {
      price = parseInt(count*ticketsTotal['from']);
      ticketsTotal['total_from'] += price;
    } else {
      price = parseInt(count*ticketsTotal['back']);
      ticketsTotal['total_back'] += price; 
    }
    
    $(this).html(price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  });
  
  $('.column-right .direction .tickets-price').hide();
  
  if(ticketsTotal['total_from']) {
    if(ticketsTotal['total_from'] > 0)
      $('.column-right .direction.from .tickets-price').show();
    $('.column-right .direction.from .tickets-price .total .right span').html(ticketsTotal['total_from'].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  }
  if(ticketsTotal['total_back']) {
    if(ticketsTotal['total_back'] > 0)
      $('.column-right .direction.back .tickets-price').show();
    $('.column-right .direction.back .tickets-price .total .right span').html(ticketsTotal['total_back'].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  }
}
calculateBaggageTotalPrice = function() {
  baggageTotal = baggageFrom = baggageBack = 0;
  
  $('.pax .column-left .addBaggage input#totalBaggagePrice').each(function() {
    price = Number($(this).val().replace(/\D+/g,""));
    
    if($(this).parents('.info-section').hasClass('from'))
      baggageFrom += price;
    else
      baggageBack += price;
    
    baggageTotal += price;
  });
  
  totalBaggageList = [];
  
  $('.pax .column-left .addBaggage input#baggageList').each(function() {
    if($(this).val()) {
      dir = $(this).parents('.info-section');
      json = JSON.parse($(this).val());
      
      if(dir.hasClass('from'))
        dir = 'from';
      else
        dir = 'back';
      
      for(i=0;i<baggageCount;i++) {
        price = Number(json[i].price.replace(/\D+/g,""));
        
        if(typeof(json[i]['count']) == 'string' && json[i]['count'] !== 'undefined') {
          type = json[i].count;
          json[i].count = 1;
        } else
          type = '';
        
        if(totalBaggageList[json[i].id+'_'+dir+'_'+type]) {
          curPrice = Number(totalBaggageList[json[i].id+'_'+dir+'_'+type].price.toString().replace(/\D+/g,""));
          
          totalBaggageList[json[i].id+'_'+dir+'_'+type] = {'dir':dir,'count': totalBaggageList[json[i].id+'_'+dir+'_'+type].count+json[i].count,'price': curPrice+json[i].count*price,'title': json[i].html};
        } else if(json[i].count > 0) {
          totalBaggageList[json[i].id+'_'+dir+'_'+type] = {'dir':dir,'count': json[i].count,'price': json[i].count*price,'title': json[i].html};
        }
      }
    }
  });

  $('.checklist .baggage .prices.sub .list').empty();
  $('.checklist .baggage').hide();
  
  for(key in totalBaggageList) {
    if(totalBaggageList[key]['count'] > 0) {
      baggage = $('.checklist .direction.'+totalBaggageList[key]['dir']+' .baggage');
      
      if(baggage.is(':hidden'))
        baggage.show();
      
      $('.checklist .direction.'+totalBaggageList[key]['dir']+' .baggage .prices.sub .list').append('<div class="left">'+totalBaggageList[key]['count']+' x '+totalBaggageList[key]['title']+'</div>'+
                              '<div class="right"><span>'+totalBaggageList[key]['price'].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+'</span> руб</div>'+
                              '<div class="clrfix"></div>');
    }
  }
  
  $('.checklist .direction.from .baggage .total .right span').html(baggageFrom.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  $('.checklist .direction.back .baggage .total .right span').html(baggageBack.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  
  $('.pax .column-left .info.baggage .total span').html(baggageTotal.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')); 
}
calculateInsuranceTotalPrice = function() {
  insuranceTotal = 0;

  $('.checklist .direction .insurance').hide();
  
  $('.pax .column-left .insurance .line input').each(function() {
    $th = $(this);
    price = Number($th.siblings('.price').text().replace(/\D+/g,""));
    
    dir = $th.attr('name') == 'insurance-from' ? 'from':'back';  
    priceLocal = $th.is(':checked') ? $th.parent().find('.price span').text() : 0;
    
    if(priceLocal > 0)
      $('.checklist .direction.'+dir+' .insurance').show();
      
    $('.checklist .direction.'+dir+' .insurance .right span').html(priceLocal);
    
    if($th.is(':checked'))
      insuranceTotal += price;
  });

  $('.pax .column-left .insurance .total .float-right span')
  .html(insuranceTotal.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  
  calculateTotalPrice();
}

calculateTotalPrice = function() {
  totalPrice = 0;
  
  $('.column-right .section:not(.totals) .head.total .right').each(function() {
    totalPrice += Number($(this).text().replace(/\D+/g,""));
  });
  
  $('.column-right .section.totals .total .right span').html(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
}

buildBaggageList = function(obj,upd_html) {
  $th = obj;
  salonsBag = $th.parents('.addBaggage').find('.radio input[type=radio]:checked:not(.null)');
  pets = $th.parents('.addBaggage').find('input[name=pets]:checked');
  
  baggageTotalLocal = 0;
  baggageCount = 2;
  
  baggage[0] = {
    'id': 'bag-0',
    'count' : ''+salonsBag.val()+'',
    'title' : ''+salonsBag.siblings('label').text()+'',
    'html' : ''+salonsBag.siblings('label').html()+'',
    'price' : ''+salonsBag.parent().siblings('.float-right').text()+''
  };
  baggage[1] = {
    'id' : 'bag-pets', 
    'count' : ''+pets.val()+'',
    'title' : ''+pets.siblings('label').text()+'',
    'html' : ''+pets.siblings('label').html()+'',
    'price' : ''+pets.parent().siblings('.price').text()+''
  };

  $th.parents('.addBaggage').find('.counter').each(function(i,v) {
    baggage[i+2] = {
              'id' : ''+$(v).attr('id')+'', 
              'count' : parseInt($(v).find('.count').html()),
              'title' : ''+$(v).parents('.counter-line').find('.title').text()+'',
              'html' : ''+$(v).parents('.counter-line').find('.title').html()+'',
              'price' : $(v).parents('.counter-line').find('.price').html()
            };
    baggageCount += 1;
  });
  
  $th.parents('.addBaggage').find('input#baggageList').val(JSON.stringify(baggage));
  
  section = $th.parents('.info-section');
  
  /*if(section.hasClass('from'))
    section.siblings('.info-section.back').find('.same').show();*/

  html = '';
    
  for(i=0;i<baggageCount;i++) {
    if(baggage[i]['count'] > 0 || typeof(baggage[i]['count']) == 'string' && baggage[i]['count'] !== 'undefined') {
      html = html + '<div class="element" data-id="'+baggage[i].id+'" data-count="'+baggage[i].count+'">'+
                      '<div class="button delete"></div>'+
                      '<div class="title">'+baggage[i].title+'</div>'+
                      '<div class="price">'+(baggage[i].count>1?baggage[i].count+' x ':'')+baggage[i].price+'</div>'+
                      '<div class="clrfix"></div>'+
                    '</div>';
                    
      baggageTotalLocal += (baggage[i].count>1?baggage[i].count:1) * Number(baggage[i].price.replace(/\D+/g,""))
    }
  }

  
  // Calculate baggage and total price
  $th.parents('.addBaggage').find('input#totalBaggagePrice').val(baggageTotalLocal);
  calculateBaggageTotalPrice();
  calculateTotalPrice();
  
  if(!upd_html) {
    $th.parents('.list').find('.inner').html(html);
    $th.parents('.addBaggage').hide();
  }
}

changeBaggageCount = function(obj, wdo) {
  $th = $(obj);
  count = $th.siblings('.count');
  parent = $th.parents('.section');
  baggageSalonCount = 0;
  
  if(wdo == 'plus') {
    newcount = parseInt(count.html()) + 1;
    if(newcount > 0)
      $th.siblings('.minus').css('opacity','1');
  } else
  {
    newcount = parseInt(count.html()) - 1;
    if(newcount < 1)
      $th.css('opacity','0.3');
  }

  if(newcount < 0)
    return false;
  
  count.html(newcount);
  
  if(parent.hasClass('baggage-salon') && newcount > 0) {
    parent.find('input[type=radio]').prop('checked',false);
    return false;
  }
   
  parent.find('.count').each(function() {
    if(parseInt($(this).text()) > 0)
      baggageSalonCount += 1;
  });
  if(parent.hasClass('baggage-salon') && baggageSalonCount < 1)
    parent.find('input[type=radio]').prop('checked',true)
}

changePassengerCount = function(obj, wdo) {
  $th = $(obj);
  count = $th.siblings('.count');
  curid = $th.parent().attr('id');
  
  if($th.hasClass('show'))
    $th.removeClass('show')
  
  adults = $('#count-adult .count').html();
  child = $('#count-child .count').html();
  baby = $('#count-baby .count').html();
  
  if(wdo == 'plus') {
    res = parseInt(count.html())+1;
    
    if(passCount > 8 && curid !== 'count-baby' || curid == 'count-baby' && res > parseInt(adults))
      return false;
    
    if(curid !== 'count-baby')
      passCount = passCount + 1;
    
    if(curid == 'count-baby' && res > parseInt(adults)-1)
      $th.css('opacity','0.3');
    if(curid == 'count-adult' && res > parseInt(baby))
      $('#count-baby .plus').css('opacity','1.0');
    if(passCount > 8 && curid !== 'count-baby')
      $('#count-adult .plus, #count-child .plus').css('opacity','0.3');
    if(res > 0)
      $th.siblings('.minus').css('opacity','1.0');
  } else
  {
    res = parseInt(count.html())-1;
    
    if(curid == 'count-adult' && res < parseInt(baby) && res >= 0) {
      $('#count-baby .count').html(res);
      $('#count-baby input').val(res);
    }
    
    if(curid !== 'count-baby' && passCount > 0)
      passCount = passCount - 1;

    if(passCount < 9 && curid !== 'count-baby')
      $('#count-adult .plus, #count-child .plus').css('opacity','1.0');;
    if(res < 1)
      $th.css('opacity','0.3');
    if(curid == 'count-baby' && res < parseInt(baby)+1)
      $th.siblings('.plus').css('opacity','1.0');
    if(curid == 'count-adult' && res < 1|| curid == 'count-adult' && res < parseInt(baby)+1)
      $('#count-baby .plus').css('opacity','0.3');
    if(curid == 'count-adult' && res < 1)
      $('#count-baby .minus').css('opacity','0.3');
  }
 
  if(res > 9 || res < 0)
    return false;
    
  count.html(res);
  $th.siblings('input').val(res);
}

Ascroll = function(parent,index) {
  if(parseInt($(window).width()) < 960)
    return false;
    
  Ra = a[index].getBoundingClientRect();
  R1bottom = document.querySelector(parent).getBoundingClientRect().bottom;
    
  if (Ra.bottom < R1bottom) {
    if (b[index] == null) {
      var Sa = getComputedStyle(a[index], ''), s = '';
      for (var i = 0; i < Sa.length; i++) {
        if (Sa[i].indexOf('overflow') == 0 || Sa[i].indexOf('padding') == 0 || Sa[i].indexOf('border') == 0 || Sa[i].indexOf('outline') == 0 || Sa[i].indexOf('box-shadow') == 0 || Sa[i].indexOf('background') == 0) {
          s += Sa[i] + ': ' +Sa.getPropertyValue(Sa[i]) + '; '
        }
      }
      b[index] = document.createElement('div');
      b[index].className = "stop";
      b[index].style.cssText = s + ' box-sizing: border-box; width: ' + a[index].offsetWidth + 'px;';
      a[index].insertBefore(b[index], a[index].firstChild);
      var l = a[index].childNodes.length;
      for (var i = 1; i < l; i++) {
        b[index].appendChild(a[index].childNodes[1]);
      }
      a[index].style.height = b[index].getBoundingClientRect().height + 'px';
      a[index].style.padding = '0';
      a[index].style.border = '0';
    }
    var Rb = b[index].getBoundingClientRect(),
        Rh = Ra.top + Rb.height,
        W = document.documentElement.clientHeight,
        R1 = Math.round(Rh - R1bottom),
        R2 = Math.round(Rh - W);
    if (Rb.height > W) {
      if (Ra.top < K[index]) {
        if (R2 > R1) {
          if (Rb.bottom - W <= 0) {
            b[index].className = 'sticky';
            b[index].style.top = W - Rb.height + 'px';
            Z[index] = Ra.top + Rb.height - W;
          } else {
            b[index].className = 'stop';
            b[index].style.top = - Z[index] + 'px';
          }
        } else {
          b[index].className = 'stop';
          b[index].style.top = - R1 +'px';
          Z[index] = R1;
        }
      } else {
        if (Ra.top - P[index] < 0) {
          if (Rb.top - P[index] >= 0) {
            b[index].className = 'sticky';
            b[index].style.top = P[index] + 'px';
            Z[index] = Ra.top - P[index];
          } else {
            b[index].className = 'stop';
            b[index].style.top = - Z[index] + 'px';
          }
        } else {
          b[index].className = '';
          b[index].style.top = '';
          Z[index] = 0;
        }
      }
      K[index] = Ra.top;
    } else {
      if ((Ra.top - P[index]) <= 0) {
        if ((Ra.top - P[index]) <= R1) {
          b[index].className = 'stop';
          b[index].style.top = - R1 +'px';
        } else {
          b[index].className = 'sticky';
          b[index].style.top = P[index] + 'px';
        }
      } else {
        b[index].className = '';
        b[index].style.top = '';
      }
    }
    window.addEventListener('resize', function() {
      if(parseInt($(window).width()) < 960) {
        b[index].className = 'stop';
        b[index].style.top = '';
        return false;
      }
      a[index].children[0].style.width = getComputedStyle(a[index], '').width
    }, false);
  }
}