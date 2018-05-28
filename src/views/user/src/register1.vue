<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .form
      w-input(label="手机号：", label-width="2.5rem", placeholder="请输入手机号", v-model="form.mobile", required, @w-blur="checkPhoneRepeat", :error="phoneError")
      w-input(v-model="form.gCode", label="验证码：", label-width="2.5rem", placeholder="请输入验证码", input-button=true, required, button-cover,:error="gCodeError", @input="checkGcode")
        img.valiImg(slot="button", @click="getPicCode", :src="url")
      w-input(v-model="form.vcode", label="手机验证码：", label-width="2.5rem", placeholder="请输入手机验证码", :error="checkCodeError", input-button=true, required, button-cover)
        .inputButton(slot="button", @click="getPhoneCode", v-show="sendMsg" ,:class="{inputButtonGray:sendMsgStatus}") 获取验证码
        .inputButton(slot="button", v-show="!sendMsg",style="background-color:gray") {{countDown}}
      button.regButton(@click="nextStep",:class="{regButtonGray:nextStepStatus}") 下一步
      p.tips 点击注册,表示同意
        span(@click="agreementShow=true") 《万物直供用户协议》
    transition(name="fade")
      .mask(@click="agreementShow=false", v-show="agreementShow")
    transition(name="fade")
      .agreementWrapper(v-show="agreementShow")
        .agreementHeader 万物直共网站用户协议
          .agreementClose(@click="agreementShow=false")
        .agreementContent
          section.section 重要须知：万物直共网站（http://www.w5zg.com/）所有权人及其关联方（下称“万物直共”）在此特别提醒您仔细阅读（未成年人应在其法定监护人的陪同下阅读）本《万物直共网站用户协议》（下称“本协议”）中的各个条款，包括但不限于免除或者限制万物直共责任的条款、对用户权利进行限制的条款以及约定争议解决方式、司法管辖的条款。您有权选择同意或者不同意本协议。
          section.section 您与万物直共均应当严格履行本协议及其补充协议所约定的各项义务，如发生争议或者纠纷，双方可以友好协商解决；协商不成的，任何一方均可提请本协议签订地南京市雨花台区人民法院以诉讼方式解决。
          section.section 您如果通过登录万物直共网站（http://www.w5zg.com/）用户注册页面、万物直共APP或万物直共提供的其他用户注册渠道（以下均合称“本网站”）注册用户账号，即视为您完全同意本协议，愿意接受本协议所有及任何条款的约束。
          .title1 1.名词解释
          section.section 除您与万物直共另有约定外，本协议及其补充协议当中的下列名词均采用如下解释：
          .title1
          section.section
            span.title2 1.1 万物直共网站用户协议：
            span 包括本协议及对本协议的不时更新和补充，具体指您与万物直共当下订立的旨在约定您登录、使用本网站，以及通过本网站下达订单、购买商品、支付货款、收取商品、售后服务等整个网购过程中，您与万物直共之间的权利、义务的书面合同。
          section.section
            span.title2 1.2 万物直共网站：
            span 指本网站，具体为万物直共享有全部著作权的、提供给您及其他用户登录和使用的一家专门做直供的网站（http://www.w5zg.com/），以及万物直共APP。
          section.section
            span.title2 1.3 商品：
            span 是通过本网站向您推荐并授权在本网站销售的具体商品的统称。
          section.section
            span.title2 1.4 品牌供应商：
            span 与万物直共签订协议，并通过本网站销售商品和服务的公司，包括品牌供应商或者其授权的经销商。
          section.section
            span.title2 1.5 购物车：
            span 是模拟线下实体商店提供给顾客放置商品的“购物车”的一个概念，指本网站向您展示您已经下达订单、准备购买但尚未支付相应的购买价款的商品信息的网页区域， 又称“虚拟购物车”。
          section.section
            span.title2 1.6 订单：
            span 指由本网站结帐程序生成的记录会员通过本网站所购买的商品的名称、品牌、价款、折扣等交易信息的表格或文件。这份文件将被用作所有可能发生的与会员购买有关的询问、请求和争议的参考。
          section.section
            span.title2 1.7 送货单：
            span 指万物直共或者其品牌供应商、授权的经销商附录在会员所订购的商品的包裹上的、供会员签收的商品销售凭证，送货单一般会简要地说明对应包裹的每一件商品的名称和数量，如发生退换货必须寄回。
          section.section
            span.title2 1.8 送货地址：
            span 指您或者其他用户通过本网站购买商品所要求的送货地址，如果没有特别说明，即为订单上所记载的送货地址。
          section.section
            span.title2 1.9 用户账号：
            span 指您通过登录本网站或者万物直共提供其他的用户账号注册渠道，注册获得并可据以登录本网站的账号。
          section.section
            span.title2 1.10 恶意评论：
            span 是指以恶意损害本网站、万物直共和/或本网站对外销售的商品为目的，组织人力或者采用计算机程序模拟正常用户在本网站上大规模发表用户评论，特别发表对本网站、万物直共和/或本网站销售的商品与事实不符的负面评论乃至违反国家有关法律法规的评论。
          section.section
            span.title2 1.11恶意订单:
            span 是指个人或组织对本网站、万物直共和/或本网站对外销售的商品无正常或实际购买需求，却组织人力或者采用计算机程序模拟正常用户在本网站上大规模拍下大量无法完结结算的订单或有效订单并申请退换货的订单。恶意订单会造成本网站产品断货或其他影响网站正常服务用户的后果。
          section.section
            span.title2 1.12现金券:
            span 是指经本网站许可，由本网站合作商户向其顾客发放的可在本网站使用的现金抵用券，现金券在任何情况下都不可以折现，现金券具体内容和使用方法见本网站公示的现金券使用规则。
          section.section
            span.title2 1.13通用券：
            span 是指由本网站根据会员消费情况发放或赠送的可在本网站使用的现金抵用券，任何情况下通用券都不可以折现，通用券具体内容和使用方法见本网站公示的通用券使用规则。
          section.section
            span.title2 1.14比价：
            span 如无特别说明，本网站所有比价对象均指此商品全国正品官方专柜日常销售平均价格（非促销清仓等特殊情况下的价格）。
          section.section
            span.title2 1.15个人信息：
            span 指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
          section.section
            span.title2 1.16个人敏感信息：
            span 包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息、14岁以下（含）儿童的个人信息等。
          section.section
            span.title2 1.17个人信息删除：
            span 指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。
          .title1 2.合同目的
          section.section 本协议旨在约定您在登录、使用本网站，通过本网站购买商品的过程中，您与万物直共双方分别作为本协议的一方合同当事人所享有的权利和所负有的义务。
          .title1 3.用户账号
          section.section
            span.title2 3.1
            span 您可以通过登录本网站的用户账号注册页面注册用户账号并设置相应的登录密码，一经注册成功，您即可以凭借用户账号及登录密码登录及使用本网站。就目前而言，上述用户账号既可能是您的移动电话号码，也可能是您的个人邮箱账号。
          section.section
            span.title2 3.2
            span 您成功注册用户账号后，如果需要使用该用户账号从本网站购买商品的，至少还应当填写一个收货人、收货地址和手机号码。除此之外，您还可以按照本网站相关页面的说明填写该用户账号项下的用户姓名、性别、生日、移动电话、固定电话、所在地地址、个人邮箱、婚姻状况、体重以及身高等个人信息，上述个人信息仅作为完善您的用户账号资料之用，是否填写并不影响您从本网站购买商品。
          section.section
            span.title2 3.3
            span 每个手机号码、每个收货地址仅对应一个会员账户。 包含但不限于以下行为，视为虚假注册：
          section.section （1）以同一手机号码注册多个账户；
          section.section （2）多个账户使用同一收货地址或同一IP地址；
          section.section 万物直共有权取消虚假注册账户在万物直共上消费的权利。
          section.section
            span.title2 3.4
            span 您务必妥善保管您的用户账号、登录密码、支付密码（如有）及您在其项下填写的所有个人信息，不得将其赠与、转让、借用或者以其他的方式提供给第三方。否则，由此给您（或万物直共、任何第三方）造成的一切损失，概由您自行承担（或者负责赔偿），包括但不限于：
          section.section （1）您无法凭借该用户账号登录、使用本网站及/或从本网站购买商品；
          section.section （2）您的该用户账号及其项下相关的万物卡、消费券（现金券、通用券）及/或资金未经您允许而被第三方盗用。
          section.section
            span.title2 3.5
            span 为了防止您及其他用户的用户账号及其项下的个人信息泄露或者被他人窃取，万物直共可能会随时采取计算机病毒查杀技术、计算机加密技术等措施进行保护。对此，您完全同意并接受，但这并不能免除本协议第3.3条所述的、您对用户账号及其项下的个人信息所负有的妥善保管义务。
          section.section
            span.title2 3.6
            span 您如果遗忘了密码或者密码被他人修改，您可以按照万物直共公布的账号及密码找回规则，通过万物直共提供的账号及密码找回系统程序进行找回，或者在第一时间联系万物直共的客服人员协助找回，但万物直共不保证一定可以找回。
          section.section
            span.title2 3.7
            span 您充分理解并完全同意：万物直共是一家面向消费者的专门做直共的网站，万物直共根据您的用户账号下的商品购买记录及其他相关信息，如果发现您此前通过本网站或者万物直共提供的其他网购渠道购买的商品大多数并非用于个人消费或者使用用途的，对于您的这个用户账号的商品购买需求，万物直共有权不予接受；您如果已经下达订单，万物直共有权不予接受订单；万物直共如果已经接受订单的，有权单方面解除并不予发货。而且，万物直共视情况还有权冻结您的这个用户账号，使之无法通过本网站以及万物直共提供的其他网购渠道下达订单、购买商品。
          section.section
            span.title2 3.8
            span 作为一个万物直共的会员，您可以邀请任何一个您的家庭成员、朋友、同事加入本站。然而，如果您希望把您的网站链接到本网站，您必须获取万物直共的预先许可，否则您将被禁止使用本网站，并且他的个人帐户将被取消。
          section.section
            span.title2 3.9
            span 如果您希望取消万物直共网站的会员资格，您所需要做的就是给我们以下电子邮件地址liuyuan@w5zg.com发一封电子邮件或致电服务热线，详细说明您的情况,一旦所有正在进行的定单和未解决事件结束后我们就取消您的个人帐户。 一旦您的个人帐户取消了，您将不再具有访问您的帐户或万物直共任何内容的权限。在您的会员期间累积的积分（如有）、现金券、通用券等也将不复存在，这些积分、现金券、通用券在任何情况下不得兑换为现金。如果您希望日后再次加入万物直共，您将可以使用相同的个人信息和住所地址创建一个新的帐户，但新账户创建后，原账户已取消的积分（如有）、代金券、通用券等也不会再被归还。您创建新账户的信息仍应真实、准确、有效和完整，为了防止窃取身份的行为，本网站可能会向您索取住所证明和身份证明。
          .title1 4.商品描述与营销信息
          section.section
            span.title2 4.1 商品描述：
            span 除非万物直共或者本网站另有说明，本网站出售的商品均为正宗的商品，相关商品信息均由品牌供应商及/或其授权的经销商提供，万物直共尽可能根据所接收到的商品信息准确、详尽地描述每一件商品。然而，由于品牌供应商及/或其授权的经销商所提供的商品信息不一定是准确、完整、可靠、有效和没有错误的，因此万物直共不保证本网站所有商品的描述和其他相关内容是准确、完整、可靠、有效和没有错误的。
          section.section
            span.title2 4.2 营销信息：
            span 您一经注册用户账号，即视为您同意万物直共及/或其关联公司通过短信或者电子邮件的方式向您注册时填写的手机号码或者电子邮箱发送相应的商品广告信息、促销优惠等营销信息；您如果不同意发送，您可以通过相应的退订功能进行退订。
          .title1 5.商品价格
          section.section 本网站上显示的所有价格都是以人民币为计价单位，包括所有的税费，但不包括运费。结帐之前运费会自动计算包含在订单总价之内。在商品详情页面里您可以找到所有的相关信息，支付价格为下订单时的有效价格。
          .title1 6.订单
          section.section
            span.title2 6.1
            span 万物直共保留对单个商品的总出售数量进行限制、对单个订单的商品购买数量及同一IP地址对同类商品购买数量进行限制的权利，且如您下单时间超过30分钟的，万物直共也将保留关闭该订单的权利。
          section.section
            span.title2 6.2
            span 根据您填写的订单信息，系统将会生成一份包含您的订单的所有必要信息的电子订单表格。在结帐的过程中，您将被邀请复查订购商品的信息、付款方式以及这些商品的运输方式和费用。依据这些信息生成的最终订单表格被认为是该次交易的有效证据，这份文件被认为是所有的发货、问题、退货和争议事项的参考，所以您必须非常仔细地复查这些信息并纠正一切可能的错误。点击“完成”意味着您认可订单表格中包含的所有信息都是正确和完整的。
          section.section
            span.title2 6.3
            span 如果您填写的收货人与用户本人不一致的，收货人的行为和意思表示视为您的行为和意思表示，您应对收货人的行为及意思表示的法律后果承担连带责任。
          .title1 7.取消订单
          section.section 您也可以选择取消订单，对反复的取消行为，我们可能会调查其原因，也可能会成为我们可能拒绝向您提供服务、冻结或关闭您的个人帐户的原因。
          .title1 8.合同成立
          section.section 您通过本网站下达了订单后，仅表示系统接收到了您下单的订单，只有万物直共将订单上的商品向您发出时，双方之间的买卖合同才成立。而且，如果您在一份订单里订购了多种商品并且万物直共只给您发出了部分商品时，您与万物直共之间仅仅就万物直共已经发出的那一部分商品成立买卖合同。
          .title1 9.商品缺货
          section.section 万物直共接收到您的订单后，如发现所订购商品全部或部分缺货，将会就商品缺货情况与您联系，您可选择取消缺货商品订购的方式变更订单或取消整个订单。如果您在收到此类通知后3天之内没有变更或取消订单，则万物直共将把有货的商品送达或者在没有一件订购的商品有货的情况下取消该订单。
          .title1 10.临时断货
          section.section 万物直共接收到您的订单后，如发现所订购商品全部或部分需临时调货的，则万物直共会告知您临时调货情况及可能的到货时间，您可以选择取消缺货商品订购的方式变更订单或继续等待或取消整个订单。
          .title1 11.配送服务
          section.section 您所订购的商品有两种配送方式：（1）由万物直共选择具有运输服务资质的公司为您提供运输代理服务；（2）由品牌供应商选择具有提供运输服务资质的公司为您提供运输代理服务。上述任一配送方式下，您确认并同意一旦万物直共或者品牌供应商向运输代理服务公司交付你订购的商品，意味着您与提供运输代理服务公司签订了运输代理协议，形成了运输代理合同法律关系； 相关商品灭失及毁损风险自商品交付至运输代理服务公司起转移给您。
          .title1 12.交货
          section.section
            span.title2 12.1
            span 需通过快递或物流配送的货物将会送达您订单上注明的送货地址，如快递或物流配送无法送达的，则万物直共有权取消该订单。
          section.section
            span.title2 12.2
            span 您也可以根据个人意愿及商品具体情况选择自提，具体以万物直共对外公布且正在实施的自提规则为准。
          section.section
            span.title2 12.3
            span 在您收到订购商品的同时，请您书面签收证明您收到了完好状态的商品。如果包装出现破损，请拒收。
          section.section
            span.title2 12.4
            span 如果送货单中的商品列表与您的订单表格中所记录的不同，或者您收到的商品与送货单中的商品列表不符，您可以按照万物直共对外公布且正在实施的退货规则进行处理。
          .title1 13.付款及所有权
          section.section 通过本网站对外销售的商品，如果在品牌供应商或其授权经销商将商品交付第三方承运人运输之时：
          section.section （1）您已经支付商品的全额的购买价款的，则其所有权于品牌供应商或其授权经销商将其交付第三方承运人之时转移至您的名下；
          section.section （2）您尚未支付商品的全额的购买价款的，则其所有权于您支付全额的购买价款之时转移至您的名下。
          section.section 在商品所有权按照前款约定转移至您的名下之前，商品所有权由品牌供应商或其授权的经销商所有。
          .title1 14.退回订单
          section.section
            span.title2 14.1
            span 如果您对您通过本网站所订购的商品不满意，您可以退回所有或部分商品。对于万物直共已经收取到的被退回的商品的价款，万物直共将扣除退货运费后之后将相应的余额返还给您。您在下达的订单如果使用了现金券或通用券的，万物直共亦将会按照本网站公示的现金券使用规则以及通用券使用规则进行处理。
          section.section
            span.title2 14.2
            span 您如果需要退货的，务必于收到商品之日起7天内主动联系万物直共客服。而且，您务必于收到商品之日起7天内，按照不影响商品正常使用及再次销售的原则，将您需要退货的商品及其包装、赠品、送货单、税务发票（如有）等送货时一并交付给您的物品和资料，全部完好无损地退回该商品的品牌供应商。否则，品牌供应商有权不予退货。除有相反的证据外，退货的日期以该商品的品牌供应商收到的包裹上显示的寄出邮戳所显示的日期为准。对于某些商品，如万物直共在商品详情页面及有关退货政策中已提示该类商品不予以退货的，您的下达订单行为将被视为您已同意接受对此类商品不予退货的安排。
          section.section
            span.title2 14.3
            span 万物直共有权拒绝不符合万物直共对外公布实施的退货政策（参阅//help.vip.com/）（待定）所规定的条件的所有退货。仅当万物直共确认以上规定的这些条款得到了适时的遵从后，万物直共才会启动返还货款金额的程序。万物直共收到退货申请后7天内，所有的退款均遵循万物直共退换货政策操作。一旦实现退款，您将收到一封确认和终止程序的站内信息。
          section.section
            span.title2 14.4
            span 如果您的退货与上述退货规定不符，您将无法获得任何退款。不过，您仍有资格自行支付费用（包括运费）以便接收已经退回的商品。如果您不想接收已经退回的商品，万物直共有权保有这些商品并保留已经收到的金额。
          .title1 15.知识产权
          section.section
            span.title2 15.1
            span 万物直共对本网站的内容享有全部知识产权，包括但不限于：编码、商标、服务标志、商号、图形、美术品、照片、肖像、文字内容、音频片断、按钮图标已及计算机软件、标识、数码下载、数据汇编都是万物直共或其内容提供者的财产，受到中华人民共和国版权相关法律法规的保护。您对其仅享有本协议约定范围内的临时的、可撤销的非专有使用权。
          section.section
            span.title2 15.2
            span 您仅在符合本网站使用目的的前提下被许可浏览和使用本网站，即以个人名义浏览信息和购买供个人使用商品的目的。其他方式的使用都是被严格禁止的，包括但不限于以下方式：复制、修改、销售、传送、再版、删除、添加、展览、记入或演示本网站的内容或以其他方式部分地或整体地非法使用本网站的内容，但经万物直共允许将本网站当中的资讯转发至微信朋友圈等第三方媒体的除外。
          .title1 16.用户守则
          section.section
            span.title2 16.1
            span 本网站与其他在线使用的互联网网站一样，您如果需要进行下载、安装、运行、登录或者使用，您至少必须自备一部可供上网的智能移动终端，并确保其能够通过互联网与本网站服务器软件进行实时的信息（即电子数据）交互，相应的上网流量费等相关费用由您自行承担。除非另有说明，万物直共存储在其服务器上的数据是万物直共和其会员之间交易的唯一有效证据。
          section.section
            span.title2 16.2
            span 本网站目前属于免费使用的网站，万物直共有权对本网站进行升级及更新，自行设置收费的软件功能、费率标准、收费对象及/或收费时段。您如果不同意万物直共设置的软件功能、费率标准、收费对象及/或收费时段的，则应当立即停止使用本网站；您如果继续使用的，则视为您接受万物直共的上述设置，您应当遵照履行并向万物直共支付相应的费用。
          section.section
            span.title2 16.3
            span 您不得进行任何侵犯本网站知识产权的行为，或者进行其他的有损于万物直共或其他用户合法权益的行为，包括但不限于：
          section.section （1）删除或修改本网站上的版权信息；
          section.section （2）修改、复制和/或发行本网站；
          section.section （3）在本网站当中内置各种插件程序或者其他的第三方程序；
          section.section （4）进行编译、反编译、反向工程或者以其他方式破解本网站的行为；
          section.section （5）使用本网站外挂和/或利用本网站当中的BUG来获得不正当的利益；
          section.section （6）利用劫持域名服务器等技术非法侵入、破坏本网站的服务器软件系统，或者修改、增加、删除、窃取、截留、替换本网站的客户端和/或服务器软件系统中的数据，或者非法挤占本网站的服务器空间，或者实施其他的使之超负荷运行的行为；
          section.section （7）假冒万物直共或签约商家在本网站当中发布任何诈骗或虚假信息；
          section.section （8）利用本网站故意传播恶意程序或计算机病毒。
          section.section
            span.title2 16.4
            span 您充分理解到：万物直共可能会不定期地通过发布软件升级包或软件补丁、在线升级等方式对本网站进行更新。更新的过程中，万物直共可能通过互联网调取、收集您的PC端终端上的关于本网站的客户端软件版本信息、数据及其他有关资料，并自动进行替换、修改、删除和/或补充。此种行为是网站更新所必须的一种操作或步骤，您如果不同意万物直共进行此种操作，请您不要进行更新；您更新的行为即视为您同意万物直共进行此种操作。
          section.section
            span.title2 16.5
            span 您有权在本网站当中发表评论，转发或者回复其他用户的评论，但您应确保评论真实、客观且不会侵犯任何第三方的著作权、肖像权、名誉权、隐私权等合法权利。而且，您不得借助本网站用户评论功能发布任何广告。
          section.section
            span.title2 16.6
            span 您应当遵守国家有关法律法规，不得在本网站当中发表、转发或者传播含有下列内容的信息：
          section.section （1）反对宪法所确定的基本原则的；
          section.section （2）危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的；
          section.section （3）损害国家荣誉和利益的；
          section.section （4）煽动民族仇恨、民族歧视，破坏民族团结的；
          section.section （5）破坏国家宗教政策，宣扬邪教和封建迷信的；
          section.section （6）散布谣言，扰乱社会秩序，破坏社会稳定的；
          section.section （7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
          section.section （8）侮辱或者诽谤他人，侵害他人合法权益的；
          section.section （9）含有法律、行政法规禁止的其他内容的。
          section.section
            span.title2 16.7
            span 个人账户是万物直共授权您使用万物直共网站用户管理系统的唯一凭证。万物直共所提供的折扣、积分、现金券、通用券、推送等服务和优惠均通过用户管理系统发放，并且仅提供给获得授权的用户个人使用。您同意在符合法律法规及本条款规定的情况下使用个人帐户，万物直共有可能在某些情况（例如：您违反本条款和/或其它公开规则，或者您严重违背社会公德、提供虚假注册身份信息或者有其他违反法律禁止性规定的行为或损害万物直共利益的不正当行为等）下暂时冻结、永久冻结、修改、删除您的个人账户或者采取其他处理措施。特别地，您了解并同意，万物直共用户管理系统中个人帐户、积分、消费券、现金券、通用券等互联网产品及服务所有权归属万物直共，会员在满足万物直共公布的规则的前提下有权使用上述产品及服务。非经万物直共同意，您不得将万物直共各项产品及服务用于商业用途（例如：销售万物直共个人帐户、销售个人帐户下积分、消费券、现金券、通用券等）。在使用万物直共服务过程中，如果您或您的个人帐户刻意规避万物直共管理措施，或存在涉嫌欺诈、商业牟利、不恰当或不诚实地使用服务或者其他违反本条款和/或其他公开规则的行为（包括但不限于使用作弊软件获取积分及/或代金券及/或消费券、贩卖个人帐号、积分及/或代金券及/或消费券、盗号、协助盗号、非用于个人或家庭的合理消费等），万物直共有权拒绝为您继续提供服务，永久冻结您的个人帐户，并根据具体情况并有权对该等个人帐号中因上述手段而产生、获得的一切虚拟产品予以清零。
          .title1 17.免责声明
          .title1 17.1 关于本网站的免责声明
          section.section
            span.title2 17.1.1
            span 本网站与其他的在线使用的互联网网站一样，也会受到各种不良信息、网络安全和网络故障问题的困扰，包括但不限于：
          section.section （1）其他用户可能会发布诈骗或虚假信息，或者发表有谩骂、诅咒、诋毁、攻击内容的，或者含有淫秽、色情、下流、反动、煽动民族仇恨等让人反感、厌恶的内容的非法言论；
          section.section （2）其他用户可能会发布一些侵犯您或者其他第三方知识产权、肖像权、姓名权、名誉权、隐私权和/或其他合法权益的图片、照片、文字等资料；
          section.section （3）面临着诸如黑客攻击、计算机病毒困扰、系统崩溃、网络掉线、网速缓慢、程序漏洞等问题的困扰和威胁。
          section.section
            span.title2 17.1.2
            span 您充分理解到：本协议第16.1.1条所述的各种不良信息、网络安全和网络故障问题，并不是万物直共或者本网站所导致的问题，由此可能会造成您感到反感、恶心、呕吐等精神损害，或者给您造成其他的损失，概由您自行承担，万物直共无须向您承担任何责任。
          section.section
            span.title2 17.1.3
            span 您完全同意：除法律法规规定或者您与万物直共约定须提前通知的以外，万物直共有权单方面地中止或者终止本网站所提供的服务而无须提前通知您。该等中止、终止，可能是因为万物直共解散、注销、合并、分立，也可能是因为万物直共将本网站或其运营权转让给了第三方，还可能是因为国家法律、法规、政策及国家机关的命令或者其他的诸如地震、火灾、海啸、台风、罢工、战争等不可抗力事件，还可能是因为您违反本协议第15.3条、第15.5、第15.6条所约定的用户守则。
          .title1 17.2关于商品销售的免责声明
          section.section
            span.title2 17.2.1
            span 由于用不同手机终端设备观看时网页显示的差异，万物直共上促销的商品在图像和颜色方面可能跟真实的物品不尽一致。因此，所有显示的图片、视频和其他商品显示方法仅限于图示目的，在任何情况下不认为是合同的组成部分。假如供出售的商品跟网站上的描述不同，对您唯一的补救措施是根据本协议在没有使用的情况下退回该商品。
          section.section
            span.title2 17.2.2
            span 万物直共保留根据市场价格波动随时修改上线商品价格的权利而无须事先通知。在由于排版错误或供应商提供价格信息错误的情况下以不正确的价格列出来的商品，万物直共有拒绝或取消任何对以不正确的价格列出来的商品所下订单的权利。
          section.section
            span.title2 17.2.3
            span 由于合理的或不可避免的送货延迟对您或第三方带来的任何损失，万物直共不负任何责任。在这种情况下，万物直共将尽快地把任何可预知的延迟情况通知您，并在此时请您选择是否取消订单。
          section.section
            span.title2 17.2.4
            span 万物直共上面陈列的货物完全符合中华人民共和国的相关法律法规的规定。万物直共直接与品牌供应商或者他们授权的经销商合作，他们保证其商品是正宗的。您在万物直共上找到的商品描述均由品牌供应商或者他们授权的经销商提供，仅由他们对其真实性负责。您应该系统性地参照货物描述找出他们的特征，对于任何种类的直接或间接的、实质或非实质的由于商品的使用造成的损失，万物直共概不负责。
          .title1 18.个人信息保护
          section.section
            span.title2 18.1
            span 万物直共可能通过本网站 在您自愿选择服务或提供信息的情况下收集您的个人信息（简称“个人信息”），例如您的姓名、邮件地址、电话号码及其他身份信息等。我们有可能会保留一些用户的使用习惯信息，用于更好地了解和服务于用户。这些数据将有利于我们开发出更符合用户需求的功能、信息和服务。
          section.section
            span.title2 18.2
            span 万物直共通过本网站可能会收集一些特定的关于您所使用的机器的技术信息，可能会包括：IP地址、操作系统版本、浏览器版本、显示器分辨率、推荐网站等。这些信息将用于提供更好的用户使用体验，提供更方便的服务。
          section.section
            span.title2 18.3
            span 万物直共非常重视保护您的万物直共账号及密码、电话号码、地理位置、智能移动终端品牌及型号等个人信息，未经您同意，万物直共不会将其披露给无关的第三方，更不会将其公之于众，但因下列原因而披露给第三方的除外：
          section.section （1）基于国家法律法规的规定而对外披露；
          section.section （2）应国家司法机关及其他有关机关基于法定程序的要求而披露；
          section.section （3）为保护万物直共或您的合法权益而披露；
          section.section （4）在紧急情况，为保护其他用户及第三方人身安全而披露；
          section.section （5）经您本人同意或应您的要求而披露。
          section.section
            span.title2 18.4
            span 万物直共将使用各种安全技术和程序防止您及其他用户个人信息的丢失、不当使用、未经授权阅览或披露。但您充分理解到：由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。
          .title1 19.其他约定
          section.section
            span.title2 19.1
            span 万物直共保留随时地、不事先通知地、不需要任何理由地、单方面地修订本协议的权利。本协议一经修订，万物直共将会用修订后的协议版本完全替代修订前的协议版本，并通过适当的方式向所有用户公布。您应当及时关注和了解本协议的修订情况，如果您不同意修订后协议版本，请您立即停止使用本网站，否则即视同您同意并完全接受修订后的协议版本。
          section.section
            span.title2 19.2
            span 万物直共有可能以消费者告知书、买家须知（购物须知）、温馨提示等形式，向您说明您在使用本网站购买商品时应当履行的本协议所约定的义务之外的其他义务，您亦应当仔细阅读并全面履行。上述说明如果与本协议相互冲突或者矛盾的，以上述约定为准；上述约定未涉及的内容，仍适用本协议。
          section.section
            span.title2 19.3
            span 万物直共将本协议内置于本网站的注册环节，您在注册的过程中即可查阅、了解本协议，并通过勾选“我已阅读并接受万物直共服务条款”表示您完全同意并接受本协议之约束，或者通过取消勾选“我已阅读并接受万物直共服务条款”表示您不同意本协议。
          section.section
            span.title2 19.4
            span 本协议各条款是可分的，所约定的任何条款如果部分或者全部无效，不影响该条款其他部分及本协议其他条款的法律效力。
          section.section
            span.title2 19.5
            span 本协议各条款的标题只是为了方便用户阅读而起到提示、醒目的作用，对本协议的解释及适用没有任何指引作用。
          section.section
            span.title2 19.6
            span 万物直共基于本协议及其补充协议的有效弃权必须是书面的，并且该弃权不能产生连带的相同或者类似的弃权。
          section.section
            span.title2 19.7
            span 您通过本网站购买非商品的服务产品（例如旅游产品）的，您与万物直共之间的权利义务亦参照本协议的相关约定。
          section.section
            span.title2 19.8
            span 您与万物直共均应当严格履行本协议及其补充协议所约定的各项义务，如发生争议或者纠纷，双方可以友好协商解决；协商不成的，任何一方均可提请南京雨花台区人民法院诉讼解决。
          section.section
            span.title2 19.9
            span 本网站的客户服务电话为：400-8947-999，您如对本协议条款有任何疑问或者需要帮助，可以通过上述电话与万物直共联系。
          section.section
            span.title2 19.10
            span 本协议及其补充协议签订地为南京市雨花台区，均受中华人民共和国法律、法规管辖。 （完）
</template>

<script>
  export default {
    name: 'register',
    data() {
      return {
        phoneError: '',
        gCodeError: '',
        checkCodeError: '',
        sendMsg: true,
        version: 1,
        countDown: 60,
        sendMsgStatus: true,
        nextStepStatus: true,
        passwordType: 'password',
        url: this.$apiMember + 'member/picCode/150/75/60',
        form: {
          mobile: '',
          gCode: '',
          vcode: '',
          type: '1'
        },
        agreementShow:false,
        phoneFlag: false
      }
    },
    mounted () {
      this.getToken()
    },
    methods: {
      getToken () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/getSessionId',
          params: {}
        }).then(function (response) {
          self.form.W5MALLTOKEN = response.data.data
          self.getPicCode()
        })
      },
      getPicCode() {
        this.version += 1
        this.url = this.$apiMember + 'member/picCode/150/75/60?v=' + this.version+'&W5MALLTOKEN='+ this.form.W5MALLTOKEN
      },
      checkPhoneRepeat() {
        let self = this
        let reg = /^1[0-9]{10}$/;
        if (self.form.mobile == '') {
          self.phoneError = '手机号为空'
          return
        }

        if(!reg.test(self.form.mobile)){
          self.phoneError = $code('261')
          return
        }else{
          self.phoneError = ''
        }

        // 发送ajax请求校验手机号重复
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/mobile/isExist',
          params: self.form
        }).then(function (response) {
          if (response) {
            self.phoneFlag = response.data.optSuc
            // 提示用户信息
            if (response.data.optSuc && self.form.gCode.trim().length === 4) {
              self.sendMsgStatus = false
            }
          }

        })
      },
      checkGcode () {
        if (this.phoneFlag && this.form.gCode.trim().length === 4) {
          this.sendMsgStatus = false
        }else {
          this.sendMsgStatus = true
        }
      },
      getPhoneCode() {
        // if (this.form.mobile.trim().length === 0) {
        //   this.phoneError = '手机号为空'
        //   return
        // }
        // if (this.form.gCode.trim().length === 0) {
        //   this.gCodeError = '图形验证码为空'
        //   return
        // }
        if(this.sendMsgStatus){
          return
        }
        this.sendMsgStatus = true
        // 发送验证码
        let self = this

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'sms/sendCode',
          params: self.form
        }).then(function (response) {
          if (response && response.data.optSuc) {
            self.nextStepStatus = false
            self.$message.success($code('2612'))
            self.sendMsg = false
            let interval = window.setInterval(function () {
              if ((self.countDown--) <= 0) {
                self.countDown = 60
                self.sendMsg = true
                self.sendMsgStatus = false
                window.clearInterval(interval)
              }
            }, 1000)
          }else{
            self.getPicCode()
            self.sendMsgStatus = false
          }
        })
      },
      nextStep() {
        let self = this
        if (self.form.mobile == '' || self.form.vcode == '' || self.nextStepStatus) {
          self.phoneError = ''
          self.checkCodeError = ''
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/validation',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({path: '/register2', query: {mobile: self.form.mobile,vcode: self.form.vcode}})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .registerBox {
    min-height: 100vh;
    background: rgb(242, 242, 242);
  }

  .form {
    margin-top: 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .inputButton {
    width: 2rem;
    height: .9rem;
    border-radius: 1rem;
    background: rgb(245, 0, 87);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .inputButtonGray {
    background: rgb(192, 192, 192) !important;
  }

  .regButton {
    margin-top: 1rem;
    width: 7rem;
    height: 1rem;
    background-color: rgb(245, 0, 87);
    color: white;
    font-size: .4rem;
    border: none;
    outline: none;
    border-radius: .5rem;
  }

  .regButtonGray {
    background-color: rgb(192, 192, 192) !important;
  }

  .tips {
    margin-top: .2rem;
    font-size: .3rem;
    color: rgb(153, 153, 153);
  }
  .tips span {
    color: rgb(245,0,87);
  }

  .valiImg {
    width: 2rem
  }
  .mask {
    width: 100%;
    height: calc(100% - 1.3rem);
    position: fixed;
    top: 1.3rem;
    left: 0;
    z-index: 101;
    background: rgba(51,51,51,.5);
    opacity: 1;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .agreementWrapper {
    position: absolute;
    top: 3rem;
    left: 10%;
    background: #fff;
    width: 80%;
    height: 70%;
    z-index: 200;
    border-radius: .1rem;
  }
  .agreementHeader {
    position: fixed;
    top: 3rem;
    left: 0;
    width: 100%;
    height: 1rem;
    text-align: center;
    font-size: .4rem;
    font-weight: bold;
    line-height: 1rem;
  }
  .agreementClose {
    position: absolute;
    top: .1rem;
    right: 11%;
    width: .5rem;
    height: .5rem;
    background: url("../../../assets/img/cancle@3x.png") no-repeat center center;
    background-size: .3rem .3rem;
  }
  .agreementContent {
    margin-top: 1rem;
    width: 100%;
    height: calc(100% - 1rem);
    overflow: auto;
    line-height: 1.5;
    padding: 0 .2rem;
    text-align: justify;
    word-wrap:break-word;
    word-break:break-all;
    font-size: .32rem;
  }
  .section {
    text-indent: 2em;
  }
  .title1 {
    text-indent: 2em;
    font-weight: bold;
  }
  .title2 {
    font-weight: bold;
    margin-right: .1rem;
  }
</style>
