App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {
    $.getJSON('../real-estate.json', function(data) {
      var list = $('#list');
      var template = $('#template');

      for (i = 0; i < data.length; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);
        template.find('.carinfo').text(data[i].carinfo);

        list.append(template.html());
      }
     
    })

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
	  $.getJSON('RealEstate.json', function(data) {
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
      App.listenToEvents();
    });
  },

  buyRealEstate: function() {	
    var id = $('#id').val();
    var name = $('#name').val();
    var price = $('#price').val();
    var age = $('#age').val();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[4];
      App.contracts.RealEstate.deployed().then(function(instance) {
        var nameUtf8Encoded = utf8.encode(name);
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), age, { from: account, value: price });
      }).then(function() {
        $('#name').val('');
        $('#age').val('');
        $('#buyModal').modal('hide');  
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

 


 


  loadRealEstates: function() {
    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getAllBuyers.call();
    }).then(function(buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          var imgType = $('.panel-realEstate').eq(i).find('img').attr('src').substr(7);

          switch(imgType) {
            case 'pig.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/pig_sold.jpg')
              break;
            case 'cow.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/cow_sold.jpg')
              break;
            case 'ken.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/ken_sold.jpg')
              break;
          }

          $('.panel-realEstate').eq(i).find('.btn-buy').text('구매완료').attr('disabled', true);
          $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style');
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    })
  },
	
  listenToEvents: function() {
	  App.contracts.RealEstate.deployed().then(function(instance) {
      instance.LogBuyRealEstate({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          $('#events').append('<p>' + event.args._buyer + ' 계정에서 ' + event.args._id + ' 번 축산물을 구매했습니다.' + '</p>');
        } else {
          console.error(error);
        }
        App.loadRealEstates();
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });
  $('#buyModal1').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });


  $('#buycareerModal').on('show.bs.modal', function(e) {

    
    var id = $(e.relatedTarget).parent().find('.id').text();
    var kind = $(e.relatedTarget).parent().find('.type').text();
    var date = $(e.relatedTarget).parent().find('.area').text();
    var grade = $(e.relatedTarget).parent().find('.carinfo').text();

    switch(id) {
      case '0':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/5/15일 배합사료  .....";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";
    
 
      break;
      case '1':
      var carinfo = "2010/5/13일 배합사료 2010/5/14일 배합사료 2010/5/15일 배합사료  .....  ";
      var healthinfo="2010/9/15일 양호 2010/9/19일 매우 양호 2010/9/20일 감기  ..... ";
      var killinfo= "2018/10/05일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '2':
      var carinfo = "2009/4/13일 배합사료 2009/4/14일 배합사료 2009/4/15일 배합사료  .....  ";
      var healthinfo="2009/9/15일 매우 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '3':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/15일 배합사료  .....  ";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '4':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/15일 배합사료  .....  ";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '5':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/15일 배합사료  .....  ";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '6':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/15일 배합사료  .....  ";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '7':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/15일 배합사료  .....";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
      case '8':
      var carinfo = "2009/5/13일 배합사료 2009/5/14일 배합사료 2009/15일 배합사료  .....  ";
      var healthinfo="2009/9/15일 양호 2009/9/19일 매우 양호 2009/9/20일 감기  ..... ";
      var killinfo= "2018/10/04일 노원구에 위치한 광운 도축장에서 도축하였으며 검사결과 합격";

      break;
    }

    $(e.currentTarget).find('#carinfo').text(carinfo);
    $(e.currentTarget).find('#healthinfo').text(healthinfo);
    $(e.currentTarget).find('#killinfo').text(killinfo);
    $(e.currentTarget).find('#kind').text(kind);
    $(e.currentTarget).find('#date').text(date);
    $(e.currentTarget).find('#grade').text(grade);
  });

  $('#buyerInfoModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo) {
      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1]));
      $(e.currentTarget).find('#buyerAge').text(buyerInfo[2]);
    }).catch(function(err) {
      console.log(err.message);
    })
  });
});
