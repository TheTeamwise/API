    $(document).ready(function() {
        
        var lang =  {
            previousMonth : 'Предыдущий месяц',
            nextMonth     : 'Следующий месяц',
            months        : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            weekdays      : ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
            weekdaysShort : ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ']
        }
        
        var startDate,
        endDate,
        updateStartDate = function() {
            startPicker.setStartRange(startDate);
            endPicker.setStartRange(startDate);
            endPicker.setMinDate(startDate);
        },
        updateEndDate = function() {
            startPicker.setEndRange(endDate);
            startPicker.setMaxDate(endDate);
            endPicker.setEndRange(endDate);
        },
        checkInput = function(date, obj) {
          endD = new Date($(obj).val().replace(/(\d+).(\d+).(\d+)/, '$2/$1/$3'));
          endDcur = new Date(date);
          day = endDcur.getDate();
          month = (endDcur.getMonth()+1);
          
          if(endD.valueOf() !== endDcur.valueOf() && date)
            $(obj).val((day < 10?'0'+day:day)+'.'+(month < 10?'0'+month:month)+'.'+endDcur.getFullYear());  
        },
        backTicket = function() {
          $('.searchform #date-from').focus();
          endDate = null;
          endPicker.setDate(null);
          $('#date-back').val('');
          
          if(startDate)
            updateStartDate();
          updateEndDate();

          $('.searchform .direction input#direction-one').prop('checked',true);
          $('.searchform #date-back').fadeOut();

          startPicker.show();
          endPicker.hide();
          
          startPicker.draw();
          endPicker.draw();
        },
        pikaFooter = function() {
          if(!$('.pika-bottom-button').is(':visible')) {
            $('.pika-single').append('<div class="clrfix"></div><div class="pika-bottom-button"><button class="btn tr small float-right">Обратный билет не нужен</button><div class="clrfix"></div></div>');
            $('.pika-bottom-button').click(function() {backTicket(); return false;});
          }
        },
        startPicker = new Pikaday({
            field: $('#date-from')[0],
            range: 'start',
            numberOfMonths: 2,
            container: $('.calendars')[0],
            format: 'DD.MM.YYYY',
            i18n : lang,
            //bound: false,
            theme: 'light-theme',
            firstDay: 1,
            minDate: calendarStart,
            maxDate: calendarEnd,
            onSelect: function() {
                startDate = this.getDate();
                updateStartDate();
              
              if($('.searchform .direction input[type=radio]:checked').attr('id') == 'direction-both') {
                startPicker.hide();
                endPicker.show();
                endPicker.gotoDate(new Date(startDate))
              }
            },
            onOpen: function() {
              if($('.searchform .direction input[type=radio]:checked').attr('id') == 'direction-one'){
                endDate = null;
                endPicker.setDate(null);
                $('#date-back').val('');
                
                updateStartDate();
                updateEndDate();
                
                startPicker.draw();
                endPicker.draw();
              } else
                checkInput(endDate,'#date-back');
                
              endPicker.hide();
            },
            onDraw: function() { pikaFooter(); }
        })
        endPicker = new Pikaday({
            field: $('#date-back')[0],
            range: 'end',
            numberOfMonths: 2,
            container: $('.calendars')[0],
            format: 'DD.MM.YYYY',
            theme: 'light-theme end',
            //bound: false,
            firstDay: 1,
            i18n : lang,
            minDate: calendarStart,
            maxDate: calendarEnd,
            onSelect: function() {
                endDate = this.getDate();
                updateEndDate();
                
                endPicker.draw();
                
                if($('.searchform .direction input[type=radio]:checked').attr('id') == 'direction-both' && !startDate) {
                  startPicker.show();
                  endPicker.hide();
                  startPicker.gotoDate(new Date(endDate))
                }
            },
            onOpen: function() {
              checkInput(startDate,'#date-from');
              
              startPicker.hide();
            },
            onClose: function() {
              
            },
            onDraw: function() { pikaFooter(); }
        }),
        _startDate = startPicker.getDate(),
        _endDate = endPicker.getDate();

        if (_startDate) {
            startDate = _startDate;
            updateStartDate();
        }

        if (_endDate) {
            endDate = _endDate;
            updateEndDate();
        }
      });