const { useState, useCallback } = React;

// 全国図鑑の世代・地方の枠組み(名前データは世代ごとに順次追加していく)
const GENERATIONS = [
  { gen: 1, region: "カントー", start: 1, end: 151, theme: "gb", count: 151, repSlots: 5 },
  { gen: 2, region: "ジョウト", start: 152, end: 251, theme: "gbc", count: 100, repSlots: 3 },
  { gen: 3, region: "ホウエン", start: 252, end: 386, theme: "gba", count: 135, repSlots: 4 },
  { gen: 4, region: "シンオウ", start: 387, end: 493, theme: "ds", count: 107, repSlots: 3 },
  { gen: 5, region: "イッシュ", start: 494, end: 649, theme: "ds", count: 156, repSlots: 5 },
  { gen: 6, region: "カロス", start: 650, end: 721, theme: "3ds", count: 72, repSlots: 2 },
  { gen: 7, region: "アローラ", start: 722, end: 809, theme: "3ds", count: 88, repSlots: 3 },
  { gen: 8, region: "ガラル", start: 810, end: 905, theme: "switch", count: 96, repSlots: 3 },
  { gen: 9, region: "パルデア", start: 906, end: 1025, theme: "switch", count: 120, repSlots: 4 },
];

const GEN1 = [
  [1,"フシギダネ"],[2,"フシギソウ"],[3,"フシギバナ"],[4,"ヒトカゲ"],[5,"リザード"],
  [6,"リザードン"],[7,"ゼニガメ"],[8,"カメール"],[9,"カメックス"],[10,"キャタピー"],
  [11,"トランセル"],[12,"バタフリー"],[13,"ビードル"],[14,"コクーン"],[15,"スピアー"],
  [16,"ポッポ"],[17,"ピジョン"],[18,"ピジョット"],[19,"コラッタ"],[20,"ラッタ"],
  [21,"オニスズメ"],[22,"オニドリル"],[23,"アーボ"],[24,"アーボック"],[25,"ピカチュウ"],
  [26,"ライチュウ"],[27,"サンド"],[28,"サンドパン"],[29,"ニドラン♀"],[30,"ニドリーナ"],
  [31,"ニドクイン"],[32,"ニドラン♂"],[33,"ニドリーノ"],[34,"ニドキング"],[35,"ピッピ"],
  [36,"ピクシー"],[37,"ロコン"],[38,"キュウコン"],[39,"プリン"],[40,"プクリン"],
  [41,"ズバット"],[42,"ゴルバット"],[43,"ナゾノクサ"],[44,"クサイハナ"],[45,"ラフレシア"],
  [46,"パラス"],[47,"パラセクト"],[48,"コンパン"],[49,"モルフォン"],[50,"ディグダ"],
  [51,"ダグトリオ"],[52,"ニャース"],[53,"ペルシアン"],[54,"コダック"],[55,"ゴルダック"],
  [56,"マンキー"],[57,"オコリザル"],[58,"ガーディ"],[59,"ウインディ"],[60,"ニョロモ"],
  [61,"ニョロゾ"],[62,"ニョロボン"],[63,"ケーシィ"],[64,"ユンゲラー"],[65,"フーディン"],
  [66,"ワンリキー"],[67,"ゴーリキー"],[68,"カイリキー"],[69,"マダツボミ"],[70,"ウツドン"],
  [71,"ウツボット"],[72,"メノクラゲ"],[73,"ドククラゲ"],[74,"イシツブテ"],[75,"ゴローン"],
  [76,"ゴローニャ"],[77,"ポニータ"],[78,"ギャロップ"],[79,"ヤドン"],[80,"ヤドラン"],
  [81,"コイル"],[82,"レアコイル"],[83,"カモネギ"],[84,"ドードー"],[85,"ドードリオ"],
  [86,"パウワウ"],[87,"ジュゴン"],[88,"ベトベター"],[89,"ベトベトン"],[90,"シェルダー"],
  [91,"パルシェン"],[92,"ゴース"],[93,"ゴースト"],[94,"ゲンガー"],[95,"イワーク"],
  [96,"スリープ"],[97,"スリーパー"],[98,"クラブ"],[99,"キングラー"],[100,"ビリリダマ"],
  [101,"マルマイン"],[102,"タマタマ"],[103,"ナッシー"],[104,"カラカラ"],[105,"ガラガラ"],
  [106,"サワムラー"],[107,"エビワラー"],[108,"ベロリンガ"],[109,"ドガース"],[110,"マタドガス"],
  [111,"サイホーン"],[112,"サイドン"],[113,"ラッキー"],[114,"モンジャラ"],[115,"ガルーラ"],
  [116,"タッツー"],[117,"シードラ"],[118,"トサキント"],[119,"アズマオウ"],[120,"ヒトデマン"],
  [121,"スターミー"],[122,"バリヤード"],[123,"ストライク"],[124,"ルージュラ"],[125,"エレブー"],
  [126,"ブーバー"],[127,"カイロス"],[128,"ケンタロス"],[129,"コイキング"],[130,"ギャラドス"],
  [131,"ラプラス"],[132,"メタモン"],[133,"イーブイ"],[134,"シャワーズ"],[135,"サンダース"],
  [136,"ブースター"],[137,"ポリゴン"],[138,"オムナイト"],[139,"オムスター"],[140,"カブト"],
  [141,"カブトプス"],[142,"プテラ"],[143,"カビゴン"],[144,"フリーザー"],[145,"サンダー"],
  [146,"ファイヤー"],[147,"ミニリュウ"],[148,"ハクリュー"],[149,"カイリュー"],[150,"ミュウツー"],
  [151,"ミュウ"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

// 進化の最終形、または進化しない単体ポケモンのID
const GEN2 = [
  [152,"チコリータ"],[153,"ベイリーフ"],[154,"メガニウム"],[155,"ヒノアラシ"],[156,"マグマラシ"],
  [157,"バクフーン"],[158,"ワニノコ"],[159,"アリゲイツ"],[160,"オーダイル"],[161,"オタチ"],
  [162,"オオタチ"],[163,"ホーホー"],[164,"ヨルノズク"],[165,"レディバ"],[166,"レディアン"],
  [167,"イトマル"],[168,"アリアドス"],[169,"クロバット"],[170,"チョンチー"],[171,"ランターン"],
  [172,"ピチュー"],[173,"ピィ"],[174,"ププリン"],[175,"トゲピー"],[176,"トゲチック"],
  [177,"ネイティ"],[178,"ネイティオ"],[179,"メリープ"],[180,"モココ"],[181,"デンリュウ"],
  [182,"キレイハナ"],[183,"マリル"],[184,"マリルリ"],[185,"ウソッキー"],[186,"ニョロトノ"],
  [187,"ハネッコ"],[188,"ポポッコ"],[189,"ワタッコ"],[190,"エイパム"],[191,"ヒマナッツ"],
  [192,"キマワリ"],[193,"ヤンヤンマ"],[194,"ウパー"],[195,"ヌオー"],[196,"エーフィ"],
  [197,"ブラッキー"],[198,"ヤミカラス"],[199,"ヤドキング"],[200,"ムウマ"],[201,"アンノーン"],
  [202,"ソーナンス"],[203,"キリンリキ"],[204,"クヌギダマ"],[205,"フォレトス"],[206,"ノコッチ"],
  [207,"グライガー"],[208,"ハガネール"],[209,"ブルー"],[210,"グランブル"],[211,"ハリーセン"],
  [212,"ハッサム"],[213,"ツボツボ"],[214,"ヘラクロス"],[215,"ニューラ"],[216,"ヒメグマ"],
  [217,"リングマ"],[218,"マグマッグ"],[219,"マグカルゴ"],[220,"ウリムー"],[221,"イノムー"],
  [222,"サニーゴ"],[223,"テッポウオ"],[224,"オクタン"],[225,"デリバード"],[226,"マンタイン"],
  [227,"エアームド"],[228,"デルビル"],[229,"ヘルガー"],[230,"キングドラ"],[231,"ゴマゾウ"],
  [232,"ドンファン"],[233,"ポリゴン2"],[234,"オドシシ"],[235,"ドーブル"],[236,"バルキー"],
  [237,"カポエラー"],[238,"ムチュール"],[239,"エレキッド"],[240,"ブビィ"],[241,"ミルタンク"],
  [242,"ハピナス"],[243,"ライコウ"],[244,"エンテイ"],[245,"スイクン"],[246,"ヨーギラス"],
  [247,"サナギラス"],[248,"バンギラス"],[249,"ルギア"],[250,"ホウオウ"],[251,"セレビィ"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN3 = [
  [252,"キモリ"],[253,"ジュプトル"],[254,"ジュカイン"],[255,"アチャモ"],[256,"ワカシャモ"],
  [257,"バシャーモ"],[258,"ミズゴロウ"],[259,"ヌマクロー"],[260,"ラグラージ"],[261,"ポチエナ"],
  [262,"グラエナ"],[263,"ジグザグマ"],[264,"マッスグマ"],[265,"ケムッソ"],[266,"カラサリス"],
  [267,"アゲハント"],[268,"マユルド"],[269,"ドクケイル"],[270,"ハスボー"],[271,"ハスブレロ"],
  [272,"ルンパッパ"],[273,"タネボー"],[274,"コノハナ"],[275,"ダーテング"],[276,"スバメ"],
  [277,"オオスバメ"],[278,"キャモメ"],[279,"ペリッパー"],[280,"ラルトス"],[281,"キルリア"],
  [282,"サーナイト"],[283,"アメタマ"],[284,"アメモース"],[285,"キノココ"],[286,"キノガッサ"],
  [287,"ナマケロ"],[288,"ヤルキモノ"],[289,"ケッキング"],[290,"ツチニン"],[291,"テッカニン"],
  [292,"ヌケニン"],[293,"ゴニョニョ"],[294,"ドゴーム"],[295,"バクオング"],[296,"マクノシタ"],
  [297,"ハリテヤマ"],[298,"ルリリ"],[299,"ノズパス"],[300,"エネコ"],[301,"エネコロロ"],
  [302,"ヤミラミ"],[303,"クチート"],[304,"ココドラ"],[305,"コドラ"],[306,"ボスゴドラ"],
  [307,"アサナン"],[308,"チャーレム"],[309,"ラクライ"],[310,"ライボルト"],[311,"プラスル"],
  [312,"マイナン"],[313,"バルビート"],[314,"イルミーゼ"],[315,"ロゼリア"],[316,"ゴクリン"],
  [317,"マルノーム"],[318,"キバニア"],[319,"サメハダー"],[320,"ホエルコ"],[321,"ホエルオー"],
  [322,"ドンメル"],[323,"バクーダ"],[324,"コータス"],[325,"バネブー"],[326,"ブビブビ"],
  [327,"パッチール"],[328,"ナックラー"],[329,"ビブラーバ"],[330,"フライゴン"],[331,"サボネア"],
  [332,"ノクタス"],[333,"チルット"],[334,"チルタリス"],[335,"ザングース"],[336,"ハブネーク"],
  [337,"ルナトーン"],[338,"ソルロック"],[339,"ドジョッチ"],[340,"ナマズン"],[341,"ヘイガニ"],
  [342,"シザリガー"],[343,"ヤジロン"],[344,"ネンドール"],[345,"リリーラ"],[346,"ユレイドル"],
  [347,"アノプス"],[348,"アーマルド"],[349,"ヒンバス"],[350,"ミロカロス"],[351,"ポワルン"],
  [352,"カクレオン"],[353,"カゲボウズ"],[354,"ジュペッタ"],[355,"ヨマワル"],[356,"サマヨール"],
  [357,"トロピウス"],[358,"チリーン"],[359,"アブソル"],[360,"ソーナノ"],[361,"ユキワラシ"],
  [362,"オニゴーリ"],[363,"タマザラシ"],[364,"トドグラー"],[365,"トドゼルガ"],[366,"パールル"],
  [367,"ハンテール"],[368,"サクラビス"],[369,"ジーランス"],[370,"ラブカス"],[371,"タツベイ"],
  [372,"コモルー"],[373,"ボーマンダ"],[374,"ダンバル"],[375,"メタング"],[376,"メタグロス"],
  [377,"レジロック"],[378,"レジアイス"],[379,"レジスチル"],[380,"ラティアス"],[381,"ラティオス"],
  [382,"カイオーガ"],[383,"グラードン"],[384,"レックウザ"],[385,"ジラーチ"],[386,"デオキシス"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN4 = [
  [387,"ナエトル"],[388,"ハヤシガメ"],[389,"ドダイトス"],[390,"ヒコザル"],[391,"モウカザル"],
  [392,"ゴウカザル"],[393,"ポッチャマ"],[394,"ポッタイシ"],[395,"エンペルト"],[396,"ムックル"],
  [397,"ムクバード"],[398,"ムクホーク"],[399,"ビッパ"],[400,"ビーダル"],[401,"コロボーシ"],
  [402,"コロトック"],[403,"コリンク"],[404,"ルクシオ"],[405,"レントラー"],[406,"スボミー"],
  [407,"ロズレイド"],[408,"ズガイドス"],[409,"ラムパルド"],[410,"タテトプス"],[411,"トリデプス"],
  [412,"ミノムッチ"],[413,"ミノマダム"],[414,"ガーメイル"],[415,"ミツハニー"],[416,"ビークイン"],
  [417,"パチリス"],[418,"ブイゼル"],[419,"フローゼル"],[420,"チェリンボ"],[421,"チェリム"],
  [422,"カラナクシ"],[423,"トリトドン"],[424,"エテボース"],[425,"フワンテ"],[426,"フワライド"],
  [427,"ミミロル"],[428,"ミミロップ"],[429,"ムウマージ"],[430,"ドンカラス"],[431,"ニャルマー"],
  [432,"ブニャット"],[433,"リーシャン"],[434,"スカンプー"],[435,"スカタンク"],[436,"ドーミラー"],
  [437,"ドータクン"],[438,"ウソハチ"],[439,"マネネ"],[440,"ピンプク"],[441,"ペラップ"],
  [442,"ミカルゲ"],[443,"フカマル"],[444,"ガバイト"],[445,"ガブリアス"],[446,"ゴンベ"],
  [447,"リオル"],[448,"ルカリオ"],[449,"ヒポポタス"],[450,"カバルドン"],[451,"スコルピ"],
  [452,"ドラピオン"],[453,"グレッグル"],[454,"ドクロッグ"],[455,"マスキッパ"],[456,"ケイコウオ"],
  [457,"ネオラント"],[458,"タマンタ"],[459,"ユキカブリ"],[460,"ユキノオー"],[461,"マニューラ"],
  [462,"ジバコイル"],[463,"ベロベルト"],[464,"ドサイドン"],[465,"モジャンボ"],[466,"エレキブル"],
  [467,"ブーバーン"],[468,"トゲキッス"],[469,"メガヤンマ"],[470,"リーフィア"],[471,"グレイシア"],
  [472,"グライオン"],[473,"マンムー"],[474,"ポリゴンZ"],[475,"エルレイド"],[476,"ダイノーズ"],
  [477,"ヨノワール"],[478,"ユキメノコ"],[479,"ロトム"],[480,"ユクシー"],[481,"エムリット"],
  [482,"アグノム"],[483,"ディアルガ"],[484,"パルキア"],[485,"ヒードラン"],[486,"レジギガス"],
  [487,"ギラティナ"],[488,"クレセリア"],[489,"フィオネ"],[490,"マナフィ"],[491,"ダークライ"],
  [492,"シェイミ"],[493,"アルセウス"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN9 = [
  [906,"ニャオハ"],[907,"ニャローテ"],[908,"マスカーニャ"],[909,"ホゲータ"],[910,"アチゲータ"],
  [911,"ラウドボーン"],[912,"クワッス"],[913,"ウェルカモ"],[914,"ウェーニバル"],[915,"グルトン"],
  [916,"パフュートン"],[917,"タマンチュラ"],[918,"ワナイダー"],[919,"マメバッタ"],[920,"エクスレッグ"],
  [921,"パモ"],[922,"パモット"],[923,"パーモット"],[924,"ワッカネズミ"],[925,"イッカネズミ"],
  [926,"パピモッチ"],[927,"バウッツェル"],[928,"ミニーブ"],[929,"オリーニョ"],[930,"オリーヴァ"],
  [931,"イキリンコ"],[932,"コジオ"],[933,"ジオヅム"],[934,"キョジオーン"],[935,"カルボウ"],
  [936,"グレンアルマ"],[937,"ソウブレイズ"],[938,"ズピカ"],[939,"ハラバリー"],[940,"カイデン"],
  [941,"タイカイデン"],[942,"オラチフ"],[943,"マフィティフ"],[944,"シルシュルー"],[945,"タギングル"],
  [946,"アノクサ"],[947,"アノホラグサ"],[948,"ノノクラゲ"],[949,"リククラゲ"],[950,"ガケガニ"],
  [951,"カプサイジ"],[952,"スコヴィラン"],[953,"シガロコ"],[954,"ベラカス"],[955,"ヒラヒナ"],
  [956,"クエスパトラ"],[957,"カヌチャン"],[958,"ナカヌチャン"],[959,"デカヌチャン"],[960,"ウミディグダ"],
  [961,"ウミトリオ"],[962,"オトシドリ"],[963,"ナミイルカ"],[964,"イルカマン"],[965,"ブロロン"],
  [966,"ブロロローム"],[967,"モトトカゲ"],[968,"ミミズズ"],[969,"キラーメ"],[970,"キラフロル"],
  [971,"ボチ"],[972,"ハカドッグ"],[973,"カラミンゴ"],[974,"アルクジラ"],[975,"ハルクジラ"],
  [976,"ミガルーサ"],[977,"ヘイラッシャ"],[978,"シャリタツ"],[979,"コノヨザル"],[980,"ドオー"],
  [981,"リキキリン"],[982,"ノココッチ"],[983,"ドドゲザン"],[984,"イダイナキバ"],[985,"サケブシッポ"],
  [986,"アラブルタケ"],[987,"ハバタクカミ"],[988,"チヲハウハネ"],[989,"スナノケガワ"],[990,"テツノワダチ"],
  [991,"テツノツツミ"],[992,"テツノカイナ"],[993,"テツノコウベ"],[994,"テツノドクガ"],[995,"テツノイバラ"],
  [996,"セビエ"],[997,"セゴール"],[998,"セグレイブ"],[999,"コレクレー"],[1000,"サーフゴー"],
  [1001,"チオンジェン"],[1002,"パオジアン"],[1003,"ディンルー"],[1004,"イーユイ"],[1005,"トドロクツキ"],
  [1006,"テツノブジン"],[1007,"コライドン"],[1008,"ミライドン"],
  [1009,"ウネルミナモ"],[1010,"テツノイサハ"],[1011,"カミッチュ"],[1012,"チャデス"],[1013,"ヤバソチャ"],
  [1014,"イイネイヌ"],[1015,"マシマシラ"],[1016,"キチキギス"],[1017,"オーガポン"],[1018,"ブリジュラス"],
  [1019,"カミツオロチ"],[1020,"ウガツホムラ"],[1021,"タケルライコ"],[1022,"テツノイワオ"],[1023,"テツノカシラ"],
  [1024,"テラパゴス"],[1025,"モモワロウ"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN5 = [
  [494,"ビクティニ"],[495,"ツタージャ"],[496,"ジャノビー"],[497,"ジャローダ"],[498,"ポカブ"],
  [499,"チャオブー"],[500,"エンブオー"],[501,"ミジュマル"],[502,"フタチマル"],[503,"ダイケンキ"],
  [504,"ミネズミ"],[505,"ミルホッグ"],[506,"ヨーテリー"],[507,"ハーデリア"],[508,"ムーランド"],
  [509,"チョロネコ"],[510,"レパルダス"],[511,"ヤナップ"],[512,"ヤナッキー"],[513,"バオップ"],
  [514,"バオッキー"],[515,"ヒヤップ"],[516,"ヒヤッキー"],[517,"ムンナ"],[518,"ムシャーナ"],
  [519,"マメパト"],[520,"ハトーボー"],[521,"ケンホロウ"],[522,"シママ"],[523,"ゼブライカ"],
  [524,"ダンゴロ"],[525,"ガントル"],[526,"ギガイアス"],[527,"コロモリ"],[528,"ココロモリ"],
  [529,"モグリュー"],[530,"ドリュウズ"],[531,"タブンネ"],[532,"ドッコラー"],[533,"ドテッコツ"],
  [534,"ローブシン"],[535,"オタマロ"],[536,"ガマガル"],[537,"ガマゲロゲ"],[538,"ナゲキ"],
  [539,"ダゲキ"],[540,"クルミル"],[541,"クルマユ"],[542,"ハハコモリ"],[543,"フシデ"],
  [544,"ホイーガ"],[545,"ペンドラー"],[546,"モンメン"],[547,"エルフーン"],[548,"チュリネ"],
  [549,"ドレディア"],[550,"バスラオ"],[551,"メグロコ"],[552,"ワルビル"],[553,"ワルビアル"],
  [554,"ダルマッカ"],[555,"ヒヒダルマ"],[556,"マラカッチ"],[557,"イシズマイ"],[558,"イワパレス"],
  [559,"ズルッグ"],[560,"ズルズキン"],[561,"シンボラー"],[562,"デスマス"],[563,"デスカーン"],
  [564,"プロトーガ"],[565,"アバゴーラ"],[566,"アーケン"],[567,"アーケオス"],[568,"ヤブクロン"],
  [569,"ダストダス"],[570,"ゾロア"],[571,"ゾロアーク"],[572,"チラーミィ"],[573,"チラチーノ"],
  [574,"ゴチム"],[575,"ゴチミル"],[576,"ゴチルゼル"],[577,"ユニラン"],[578,"ダブラン"],
  [579,"ランクルス"],[580,"コアルヒー"],[581,"スワンナ"],[582,"バニプッチ"],[583,"バニリッチ"],
  [584,"バイバニラ"],[585,"シキジカ"],[586,"メブキジカ"],[587,"エモンガ"],[588,"カブルモ"],
  [589,"シュバルゴ"],[590,"タマゲタケ"],[591,"モロバレル"],[592,"プルリル"],[593,"ブルンゲル"],
  [594,"ママンボウ"],[595,"バチュル"],[596,"デンチュラ"],[597,"テッシード"],[598,"ナットレイ"],
  [599,"ギアル"],[600,"ギギアル"],[601,"ギギギアル"],[602,"シビシラス"],[603,"シビビール"],
  [604,"シビルドン"],[605,"リグレー"],[606,"オーベム"],[607,"ヒトモシ"],[608,"ランプラー"],
  [609,"シャンデラ"],[610,"キバゴ"],[611,"オノンド"],[612,"オノノクス"],[613,"クマシュン"],
  [614,"ツンベアー"],[615,"フリージオ"],[616,"チョボマキ"],[617,"アギルダー"],[618,"マッギョ"],
  [619,"コジョフー"],[620,"コジョンド"],[621,"クリムガン"],[622,"ゴビット"],[623,"ゴルーグ"],
  [624,"コマタナ"],[625,"キリキザン"],[626,"バッフロン"],[627,"ワシボン"],[628,"ウォーグル"],
  [629,"バルチャイ"],[630,"バルジーナ"],[631,"クイタラン"],[632,"アイアント"],[633,"モノズ"],
  [634,"ジヘッド"],[635,"サザンドラ"],[636,"メラルバ"],[637,"ウルガモス"],[638,"コバルオン"],
  [639,"テラキオン"],[640,"ビリジオン"],[641,"トルネロス"],[642,"ボルトロス"],[643,"レシラム"],
  [644,"ゼクロム"],[645,"ランドロス"],[646,"キュレム"],[647,"ケルディオ"],[648,"メロエッタ"],
  [649,"ゲノセクト"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN6 = [
  [650,"ハリマロン"],[651,"ハリボーグ"],[652,"ブリガロン"],[653,"フォッコ"],[654,"テールナー"],
  [655,"マフォクシー"],[656,"ケロマツ"],[657,"ゲコガシラ"],[658,"ゲッコウガ"],[659,"ホルビー"],
  [660,"ホルード"],[661,"ヤヤコマ"],[662,"ヒノヤコマ"],[663,"ファイアロー"],[664,"コフキムシ"],
  [665,"コフーライ"],[666,"ビビヨン"],[667,"シシコ"],[668,"カエンジシ"],[669,"フラベベ"],
  [670,"フラエッテ"],[671,"フラージェス"],[672,"メェークル"],[673,"ゴーゴート"],[674,"ヤンチャム"],
  [675,"ゴロンダ"],[676,"トリミアン"],[677,"ニャスパー"],[678,"ニャオニクス"],[679,"ヒトツキ"],
  [680,"ニダンギル"],[681,"ギルガルド"],[682,"シュシュプ"],[683,"フレフワン"],[684,"ペロッパフ"],
  [685,"ペロリーム"],[686,"マーイーカ"],[687,"カラマネロ"],[688,"カメテテ"],[689,"ガメノデス"],
  [690,"クズモー"],[691,"ドラミドロ"],[692,"ウデッポウ"],[693,"ブロスター"],[694,"エリキテル"],
  [695,"エレザード"],[696,"チゴラス"],[697,"ガチゴラス"],[698,"アマルス"],[699,"アマルルガ"],
  [700,"ニンフィア"],[701,"ルチャブル"],[702,"デデンネ"],[703,"メレシー"],[704,"ヌメラ"],
  [705,"ヌメイル"],[706,"ヌメルゴン"],[707,"クレッフィ"],[708,"ボクレー"],[709,"オーロット"],
  [710,"バケッチャ"],[711,"パンプジン"],[712,"カチコール"],[713,"クレベース"],[714,"オンバット"],
  [715,"オンバーン"],[716,"ゼルネアス"],[717,"イベルタル"],[718,"ジガルデ"],[719,"ディアンシー"],
  [720,"フーパ"],[721,"ボルケニオン"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN7 = [
  [722,"モクロー"],[723,"フクスロー"],[724,"ジュナイパー"],[725,"ニャビー"],[726,"ニャヒート"],
  [727,"ガオガエン"],[728,"アシマリ"],[729,"オシャマリ"],[730,"アシレーヌ"],[731,"ツツケラ"],
  [732,"ケララッパ"],[733,"ドデカバシ"],[734,"ヤングース"],[735,"デカグース"],[736,"アゴジムシ"],
  [737,"デンヂムシ"],[738,"クワガノン"],[739,"マケンカニ"],[740,"ケケンカニ"],[741,"オドリドリ"],
  [742,"アブリー"],[743,"アブリボン"],[744,"イワンコ"],[745,"ルガルガン"],[746,"ヨワシ"],
  [747,"ヒドイデ"],[748,"ドヒドイデ"],[749,"ドロバンコ"],[750,"バンバドロ"],[751,"シズクモ"],
  [752,"オニシズクモ"],[753,"カリキリ"],[754,"ラランテス"],[755,"ネマシュ"],[756,"マシェード"],
  [757,"ヤトウモリ"],[758,"エンニュート"],[759,"ヌイコグマ"],[760,"キテルグマ"],[761,"アマカジ"],
  [762,"アママイコ"],[763,"アマージョ"],[764,"キュワワー"],[765,"ヤレユータン"],[766,"ナゲツケサル"],
  [767,"コソクムシ"],[768,"グソクムシャ"],[769,"スナバァ"],[770,"シロデスナ"],[771,"ナマコブシ"],
  [772,"タイプ:ヌル"],[773,"シルヴァディ"],[774,"メテノ"],[775,"ネッコアラ"],[776,"バクガメス"],
  [777,"トゲデマル"],[778,"ミミッキュ"],[779,"ハギギシリ"],[780,"ジジーロン"],[781,"ダダリン"],
  [782,"ジャラコ"],[783,"ジャランゴ"],[784,"ジャラランガ"],[785,"カプ・コケコ"],[786,"カプ・テテフ"],
  [787,"カプ・ブルル"],[788,"カプ・レヒレ"],[789,"コスモッグ"],[790,"コスモウム"],[791,"ソルガレオ"],
  [792,"ルナアーラ"],[793,"ウツロイド"],[794,"マッシブーン"],[795,"フェローチェ"],[796,"デンジュモク"],
  [797,"テッカグヤ"],[798,"カミツルギ"],[799,"アクジキング"],[800,"ネクロズマ"],[801,"マギアナ"],
  [802,"マーシャドー"],[803,"ベベノム"],[804,"アーゴヨン"],[805,"ツンデツンデ"],[806,"ズガドーン"],
  [807,"ゼラオラ"],[808,"メルタン"],[809,"メルメタル"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const GEN8 = [
  [810,"サルノリ"],[811,"バチンキー"],[812,"ゴリランダー"],[813,"ヒバニー"],[814,"ラビフット"],
  [815,"エースバーン"],[816,"メッソン"],[817,"ジメレオン"],[818,"インテレオン"],[819,"ホシガリス"],
  [820,"ヨクバリス"],[821,"ココガラ"],[822,"アオガラス"],[823,"アーマーガア"],[824,"サッチムシ"],
  [825,"レドームシ"],[826,"イオルブ"],[827,"クスネ"],[828,"フォクスライ"],[829,"ヒメンカ"],
  [830,"ワタシラガ"],[831,"ウールー"],[832,"バイウールー"],[833,"カムカメ"],[834,"カジリガメ"],
  [835,"ワンパチ"],[836,"パルスワン"],[837,"タンドン"],[838,"トロッゴン"],[839,"セキタンザン"],
  [840,"カジッチュ"],[841,"アップリュー"],[842,"タルップル"],[843,"スナヘビ"],[844,"サダイジャ"],
  [845,"ウッウ"],[846,"サシカマス"],[847,"カマスジョー"],[848,"エレズン"],[849,"ストリンダー"],
  [850,"ヤクデ"],[851,"マルヤクデ"],[852,"タタッコ"],[853,"オトスパス"],[854,"ヤバチャ"],
  [855,"ポットデス"],[856,"ミブリム"],[857,"テブリム"],[858,"ブリムオン"],[859,"ベロバー"],
  [860,"ギモー"],[861,"オーロンゲ"],[862,"タチフサグマ"],[863,"ニャイキング"],[864,"サニゴーン"],
  [865,"ネギガナイト"],[866,"バリコオル"],[867,"デスバーン"],[868,"マホミル"],[869,"マホイップ"],
  [870,"タイレーツ"],[871,"バチンウニ"],[872,"ユキハミ"],[873,"モスノウ"],[874,"イシヘンジン"],
  [875,"コオリッポ"],[876,"イエッサン"],[877,"モルペコ"],[878,"ゾウドウ"],[879,"ダイオウドウ"],
  [880,"パッチラゴン"],[881,"パッチルドン"],[882,"ウオノラゴン"],[883,"ウオチルドン"],[884,"ジュラルドン"],
  [885,"ドラメシヤ"],[886,"ドロンチ"],[887,"ドラパルト"],[888,"ザシアン"],[889,"ザマゼンタ"],
  [890,"ムゲンダイナ"],[891,"ダクマ"],[892,"ウーラオス"],[893,"ザルード"],[894,"レジエレキ"],
  [895,"レジドラゴ"],[896,"ブリザポス"],[897,"レイスポス"],[898,"バドレックス"],[899,"アヤシシ"],
  [900,"バサギリ"],[901,"ガチグマ"],[902,"イダイトウ"],[903,"オオニューラ"],[904,"ハリーマン"],
  [905,"ラブトロス"],
].map(([id, name]) => ({
  id,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

// 第一世代: 後の世代で進化先が追加されたポケモン(オコリザル→コノヨザル、
// ゴルバット→クロバット等)は除外して更新
const FINAL_IDS_GEN1 = new Set([
  3,6,9,12,15,18,20,22,24,26,28,31,34,36,38,40,45,47,49,
  51,53,55,58,59,62,65,68,71,73,76,78,80,85,87,89,91,
  94,97,99,101,103,105,106,107,115,119,121,122,124,
  127,128,130,131,132,134,135,136,139,141,142,143,144,145,146,149,
  150,151,
]);

const FINAL_IDS_GEN2 = new Set([
  154,157,160,162,164,166,168,169,171,178,181,182,184,185,186,189,192,195,196,
  197,199,201,202,205,208,210,212,213,214,219,222,224,225,226,227,229,230,232,
  235,237,241,242,243,244,245,248,249,250,251,
]);

const FINAL_IDS_GEN3 = new Set([
  254,257,260,262,264,267,269,272,275,277,279,282,284,286,289,291,292,295,297,
  301,302,303,306,308,310,311,312,313,314,317,319,321,323,324,326,327,330,332,
  334,335,336,337,338,340,342,344,346,348,350,351,352,354,357,358,359,362,365,
  367,368,369,370,373,376,377,378,379,380,381,382,383,384,385,386,
]);

const FINAL_IDS_GEN4 = new Set([
  389,392,395,398,400,402,405,407,409,411,413,414,416,417,419,421,423,424,426,
  428,429,430,432,435,437,441,442,445,448,450,452,454,455,457,460,461,462,463,
  464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,
  483,484,485,486,487,488,489,490,491,492,493,
]);

const FINAL_IDS_GEN5 = new Set([
  494,497,500,503,505,508,510,512,514,516,518,521,523,526,528,530,531,534,537,
  538,539,542,545,547,549,553,556,558,560,561,563,565,567,569,571,573,576,579,
  581,584,586,587,589,591,594,596,598,601,604,606,609,612,614,615,617,618,620,
  621,623,626,628,630,631,632,635,637,638,639,640,641,642,643,644,645,646,647,
  648,649,
]);

const FINAL_IDS_GEN6 = new Set([
  652,655,658,660,663,666,668,671,673,675,676,678,681,683,685,687,689,691,693,
  695,697,699,700,701,702,703,706,707,709,711,713,715,716,717,718,719,720,721,
]);

const FINAL_IDS_GEN7 = new Set([
  724,727,730,733,735,738,740,741,743,745,746,748,750,752,754,756,758,760,763,
  764,765,766,768,770,771,773,774,775,776,777,778,779,780,781,784,785,786,787,
  788,791,792,793,794,795,796,797,798,799,800,801,802,804,805,806,807,809,
]);

const FINAL_IDS_GEN8 = new Set([
  812,815,818,820,823,826,828,830,832,834,836,839,841,842,844,845,847,849,851,
  853,855,858,861,862,863,864,865,866,867,869,870,871,873,874,875,876,877,879,
  880,881,882,883,887,888,889,890,892,893,894,895,896,897,898,899,900,901,902,
  903,904,905,
]);

const FINAL_IDS_GEN9 = new Set([
  908,911,914,916,918,920,923,925,927,930,931,934,936,937,939,941,943,945,947,
  949,950,952,954,956,959,961,962,964,966,967,968,970,972,973,975,976,977,978,
  979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,998,
  1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1013,1014,1015,1016,
  1017,1018,1019,1020,1021,1022,1023,1024,1025,
]);

const FINAL_IDS_BY_GEN = {
  1: FINAL_IDS_GEN1, 2: FINAL_IDS_GEN2, 3: FINAL_IDS_GEN3, 4: FINAL_IDS_GEN4,
  5: FINAL_IDS_GEN5, 6: FINAL_IDS_GEN6, 7: FINAL_IDS_GEN7, 8: FINAL_IDS_GEN8,
  9: FINAL_IDS_GEN9,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pad3 = (id) => String(id).padStart(3, "0");

// 通常フォルムと一緒に小さく表示したい別フォルム(ガラルのすがた等)
// 画像ファイルは images/<altKey>.png として配置する
const ALT_FORMS = {
  144: { key: "144-galar", label: "ガラルのすがた" },
  145: { key: "145-galar", label: "ガラルのすがた" },
  146: { key: "146-galar", label: "ガラルのすがた" },
};

const ALT_IMG_SOURCES = (altKey) => [`${altKey}.png`];

const IMG_SOURCES = (id) => [
  `${pad3(id)}.png`,
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  `https://cdn.jsdelivr.net/gh/PokeAPI/sprites/sprites/pokemon/other/official-artwork/${id}.png`,
  `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pad3(id)}.png`,
  `https://images.weserv.nl/?url=${encodeURIComponent(
    `raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  )}`,
  `https://cdn.jsdelivr.net/gh/PokeAPI/sprites/sprites/pokemon/${id}.png`,
];

function AltFormBadge({ mon, size = 40 }) {
  const alt = ALT_FORMS[mon.id];
  const [srcIndex, setSrcIndex] = useState(0);
  if (!alt) return null;
  const sources = ALT_IMG_SOURCES(alt.key);
  if (srcIndex >= sources.length) return null;
  return (
    <img
      className="alt-form-badge"
      src={sources[srcIndex]}
      alt={`${mon.name}(${alt.label})`}
      title={alt.label}
      draggable={false}
      style={{ width: size, height: size }}
      onError={() => setSrcIndex((i) => i + 1)}
    />
  );
}

function PokemonCard({ mon, onPick }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = IMG_SOURCES(mon.id);
  const broken = srcIndex >= sources.length;
  return (
    <button onClick={() => onPick(mon)} className="lcd-card">
      <div className="lcd-card-imgwrap">
        {!broken ? (
          <img
            src={sources[srcIndex]}
            alt={mon.name}
            draggable={false}
            onError={() => setSrcIndex((i) => i + 1)}
          />
        ) : (
          <div className="lcd-fallback">?</div>
        )}
        <AltFormBadge mon={mon} size={36} />
      </div>
      <div className="lcd-card-name">{mon.name}</div>
    </button>
  );
}

function ResultImage({ mon }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = IMG_SOURCES(mon.id);
  const broken = srcIndex >= sources.length;
  return (
    <div className="result-img-wrap">
      {!broken ? (
        <img
          className="result-img"
          src={sources[srcIndex]}
          alt={mon.name}
          onError={() => setSrcIndex((i) => i + 1)}
        />
      ) : (
        <div className="lcd-fallback">?</div>
      )}
      <AltFormBadge mon={mon} size={56} />
    </div>
  );
}

const GROUP_SIZE = 3;
const RANKING_LIMIT = 20;

const POKEMON_BY_GEN = {
  1: GEN1, 2: GEN2, 3: GEN3, 4: GEN4, 5: GEN5,
  6: GEN6, 7: GEN7, 8: GEN8, 9: GEN9,
};

function App() {
  const [phase, setPhase] = useState("title"); // title | battle | result | ranking
  const [currentRound, setCurrentRound] = useState([]);
  const [winners, setWinners] = useState([]);
  const [deferred, setDeferred] = useState([]);
  const [eliminated, setEliminated] = useState([]); // [{...mon, round}]
  const [index, setIndex] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const [winner, setWinner] = useState(null);
  const [flash, setFlash] = useState(false);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("all"); // all | final
  const [selectedGen, setSelectedGen] = useState(1);

  const ranking = winner
    ? [
        winner,
        ...[...eliminated]
          .sort((a, b) => b.round - a.round)
          .slice(0, RANKING_LIMIT - 1),
      ]
    : [];

  // ===== ワールドカップ機能 =====
  const [wcPhase, setWcPhase] = useState(null); // null | hub | group | knockout | champion
  const [wcReps, setWcReps] = useState({}); // { [gen]: [mon,...] | undefined }
  const [wcActiveGen, setWcActiveGen] = useState(null);
  const [wcGroups, setWcGroups] = useState([]);
  const [wcGroupIndex, setWcGroupIndex] = useState(0);
  const [wcMatchIndex, setWcMatchIndex] = useState(0);
  const [wcWins, setWcWins] = useState({});
  const [wcGroupWinners, setWcGroupWinners] = useState([]);
  const [wcBracket, setWcBracket] = useState([]);
  const [wcBracketIndex, setWcBracketIndex] = useState(0);
  const [wcBracketWinners, setWcBracketWinners] = useState([]);
  const [wcChampion, setWcChampion] = useState(null);
  const [wcRoundLabel, setWcRoundLabel] = useState("");

  const loadWcStatus = useCallback(async () => {
    const map = {};
    for (const g of GENERATIONS) {
      try {
        const res = await window.storage.get(`wc_rep_gen${g.gen}`, false);
        map[g.gen] = res ? JSON.parse(res.value) : null;
      } catch (e) {
        map[g.gen] = null;
      }
    }
    setWcReps(map);
  }, []);

  const openWcHub = useCallback(() => {
    setPhase("wc");
    setWcPhase("hub");
    loadWcStatus();
  }, [loadWcStatus]);

  const startWcPrelim = useCallback(
    (gen) => {
      setWcActiveGen(gen);
      setSelectedGen(gen);
      setMode("all");
      const basePool = POKEMON_BY_GEN[gen] || GEN1;
      const shuffled = shuffle(basePool);
      setCurrentRound(shuffled);
      setWinners([]);
      setDeferred([]);
      setEliminated([]);
      setIndex(0);
      setRoundNum(1);
      setWinner(null);
      setHistory([]);
      setPhase("battle");
    },
    []
  );

  const saveWcRep = useCallback(async () => {
    const genInfo = GENERATIONS.find((g) => g.gen === wcActiveGen);
    const slots = genInfo ? genInfo.repSlots : 3;
    const topN = ranking.slice(0, slots);
    try {
      await window.storage.set(
        `wc_rep_gen${wcActiveGen}`,
        JSON.stringify(topN),
        false
      );
    } catch (e) {
      // 保存に失敗しても遊び自体は続けられるようにする
    }
    setWcActiveGen(null);
    openWcHub();
  }, [wcActiveGen, ranking, openWcHub]);

  const buildRoundRobinPairs = () => [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
  ];

  const startGroupStage = useCallback(() => {
    const all = GENERATIONS.flatMap((g) => wcReps[g.gen] || []);
    const shuffled = shuffle(all);
    const groups = [];
    for (let i = 0; i < 8; i++) {
      groups.push(shuffled.slice(i * 4, i * 4 + 4));
    }
    setWcGroups(groups);
    setWcGroupIndex(0);
    setWcMatchIndex(0);
    setWcWins({});
    setWcGroupWinners([]);
    setPhase("wc");
    setWcPhase("group");
  }, [wcReps]);

  const handleGroupPick = (mon) => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    const newWins = { ...wcWins, [mon.id]: (wcWins[mon.id] || 0) + 1 };
    const nextMatchIndex = wcMatchIndex + 1;
    if (nextMatchIndex >= 6) {
      const group = wcGroups[wcGroupIndex];
      let best = group[0];
      let bestScore = -1;
      for (const p of group) {
        const score = newWins[p.id] || 0;
        if (score > bestScore) {
          bestScore = score;
          best = p;
        }
      }
      const newGroupWinners = [...wcGroupWinners, best];
      const nextGroupIndex = wcGroupIndex + 1;
      if (nextGroupIndex >= wcGroups.length) {
        setWcGroupWinners(newGroupWinners);
        setWcBracket(shuffle(newGroupWinners));
        setWcBracketIndex(0);
        setWcBracketWinners([]);
        setWcRoundLabel("準々決勝");
        setWcPhase("knockout");
      } else {
        setWcGroupWinners(newGroupWinners);
        setWcGroupIndex(nextGroupIndex);
        setWcMatchIndex(0);
        setWcWins({});
      }
    } else {
      setWcWins(newWins);
      setWcMatchIndex(nextMatchIndex);
    }
  };

  const handleKnockoutPick = (mon) => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    const newWinners = [...wcBracketWinners, mon];
    const nextIndex = wcBracketIndex + 2;
    if (nextIndex >= wcBracket.length) {
      if (newWinners.length === 1) {
        setWcChampion(newWinners[0]);
        setWcPhase("champion");
      } else {
        setWcBracket(shuffle(newWinners));
        setWcBracketIndex(0);
        setWcBracketWinners([]);
        setWcRoundLabel(
          newWinners.length === 4
            ? "準決勝"
            : newWinners.length === 2
            ? "決勝"
            : `ラウンド(残り${newWinners.length})`
        );
      }
    } else {
      setWcBracketWinners(newWinners);
      setWcBracketIndex(nextIndex);
    }
  };

  const wcAllRepsReady =
    GENERATIONS.length > 0 &&
    GENERATIONS.every((g) => wcReps[g.gen] && wcReps[g.gen].length > 0);
  const wcDoneCount = GENERATIONS.filter(
    (g) => wcReps[g.gen] && wcReps[g.gen].length > 0
  ).length;

  const start = useCallback(() => {
    const basePool = POKEMON_BY_GEN[selectedGen] || GEN1;
    const finalSet = FINAL_IDS_BY_GEN[selectedGen];
    const pool =
      mode === "final" && finalSet
        ? basePool.filter((p) => finalSet.has(p.id))
        : basePool;
    const shuffled = shuffle(pool);
    setCurrentRound(shuffled);
    setWinners([]);
    setDeferred([]);
    setEliminated([]);
    setIndex(0);
    setRoundNum(1);
    setWinner(null);
    setHistory([]);
    setPhase("battle");
  }, [mode, selectedGen]);

  const options = currentRound.slice(index, index + GROUP_SIZE);

  const pushSnapshot = useCallback(() => {
    setHistory((h) => [
      ...h,
      { currentRound, winners, deferred, eliminated, index, roundNum, phase: "battle" },
    ]);
  }, [currentRound, winners, deferred, eliminated, index, roundNum]);

  const resolveRoundEnd = useCallback(
    (newWinners, newDeferred, newEliminated, newIndex, lastGroup) => {
      if (newIndex >= currentRound.length) {
        let combined = [...newWinners, ...newDeferred];
        let finalEliminated = newEliminated;
        if (combined.length === 0 && lastGroup && lastGroup.length > 0) {
          // 全員を除外すると誰も残らなくなるので、最後のグループだけ救済して勝ち上がらせる
          combined = lastGroup;
          finalEliminated = newEliminated.slice(0, newEliminated.length - lastGroup.length);
        }
        if (combined.length === 1) {
          setWinner(combined[0]);
          setEliminated(finalEliminated);
          setPhase("result");
          return;
        }
        setCurrentRound(shuffle(combined));
        setWinners([]);
        setDeferred([]);
        setEliminated(finalEliminated);
        setIndex(0);
        setRoundNum((r) => r + 1);
      } else {
        setWinners(newWinners);
        setDeferred(newDeferred);
        setEliminated(newEliminated);
        setIndex(newIndex);
      }
    },
    [currentRound]
  );

  const handlePick = (mon) => {
    pushSnapshot();
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    const losers = options.filter((o) => o.id !== mon.id);
    const newEliminated = [
      ...eliminated,
      ...losers.map((l) => ({ ...l, round: roundNum })),
    ];
    const newWinners = [...winners, mon];
    const newIndex = index + options.length;
    resolveRoundEnd(newWinners, deferred, newEliminated, newIndex, null);
  };

  const handleSkip = () => {
    pushSnapshot();
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    const newEliminated = [
      ...eliminated,
      ...options.map((o) => ({ ...o, round: roundNum })),
    ];
    const newIndex = index + options.length;
    resolveRoundEnd(winners, deferred, newEliminated, newIndex, options);
  };

  const handleBack = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setCurrentRound(prev.currentRound);
      setWinners(prev.winners);
      setDeferred(prev.deferred);
      setEliminated(prev.eliminated);
      setIndex(prev.index);
      setRoundNum(prev.roundNum);
      setWinner(null);
      setPhase(prev.phase);
      return h.slice(0, -1);
    });
  };

  const goToTitle = () => {
    setWcActiveGen(null);
    setWinner(null);
    setPhase("title");
  };

  // auto-bye: only one contestant left in this slot
  if (phase === "battle" && options.length === 1) {
    setTimeout(() => handlePick(options[0]), 0);
  }

  const pairsThisRound = Math.ceil(currentRound.length / GROUP_SIZE) || 1;
  const pairsDone = Math.floor(index / GROUP_SIZE);

  const currentTheme =
    GENERATIONS.find((g) => g.gen === selectedGen)?.theme || "gb";

  return (
    <div className={`gb-outer theme-${currentTheme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Zen+Maru+Gothic:wght@500;700&display=swap');

        * { box-sizing: border-box; }
        .gb-outer {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at top, #4a4d43, #1c1e18);
          padding: 20px 12px;
          font-family: 'Zen Maru Gothic', sans-serif;
        }
        .gb-body {
          width: 100%;
          max-width: 380px;
          background: linear-gradient(160deg, #dfe1d4, #b9bcac);
          border-radius: 22px 22px 40px 22px;
          padding: 18px 16px 26px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.4);
          position: relative;
          transition: background 0.4s ease;
        }

        /* ゲームボーイカラー風テーマ(第二世代) */
        .theme-gbc .gb-body {
          background: linear-gradient(160deg, #6b3fa0dd, #4a2a7add);
          border-radius: 16px 16px 34px 34px;
        }
        .theme-gbc .gb-brand { color: #e0d0ff; }
        .theme-gbc .gb-screen-bezel { background: #241733; }
        .theme-gbc .gb-screen {
          background: #d9f2ff;
          box-shadow: inset 0 0 0 3px #16324a;
        }
        .theme-gbc .gb-screen.flash::after { background: #16324a; }
        .theme-gbc .lcd-header,
        .theme-gbc .title-wrap h1,
        .theme-gbc .result-wrap h2,
        .theme-gbc .result-name,
        .theme-gbc .ranking-rank,
        .theme-gbc .ranking-name,
        .theme-gbc .lcd-card-name { color: #16324a; }
        .theme-gbc .title-wrap p,
        .theme-gbc .gen-status { color: #2c5170; }
        .theme-gbc .lcd-header { border-bottom-color: #6ea8c9; }
        .theme-gbc .lcd-card { background: #ffffff; border-color: #16324a; }
        .theme-gbc .lcd-card:active { background: #bfe3f5; }
        .theme-gbc .skip-btn { border-color: #2c5170; color: #2c5170; }
        .theme-gbc .skip-hint { color: #3d6f8f; }
        .theme-gbc .gb-button,
        .theme-gbc .back-btn {
          background: #16324a;
          color: #d9f2ff;
          box-shadow: 0 3px 0 #0a1c2b;
        }
        .theme-gbc .mode-btn { background: #ffffff; color: #2c5170; border-color: #2c5170; }
        .theme-gbc .mode-btn.active { background: #16324a; color: #d9f2ff; border-color: #16324a; }
        .theme-gbc .gen-row { background: #ffffff; border-color: #2c5170; color: #16324a; }
        .theme-gbc .gen-row.selected { background: #16324a; color: #d9f2ff; }
        .theme-gbc .gen-row.selected .gen-status { color: #d9f2ff; }
        .theme-gbc .ranking-row { background: #ffffff; border-color: #16324a; }
        .theme-gbc .gb-dpad::before,
        .theme-gbc .gb-dpad::after { background: #241733; }
        .theme-gbc .gb-ab-btn { background: #ff6fae; box-shadow: 0 3px 0 #c23e79; }

        /* ゲームボーイアドバンス風テーマ(第三世代) */
        .theme-gba .gb-body {
          background: linear-gradient(160deg, #5a3fa8, #3d2a7a);
          border-radius: 10px 10px 26px 26px;
        }
        .theme-gba .gb-brand { color: #d6c9ff; }
        .theme-gba .gb-screen-bezel { background: #1c1330; }
        .theme-gba .gb-screen {
          background: #cfe8c8;
          box-shadow: inset 0 0 0 3px #2e4a24;
        }
        .theme-gba .gb-screen.flash::after { background: #2e4a24; }
        .theme-gba .lcd-header,
        .theme-gba .title-wrap h1,
        .theme-gba .result-wrap h2,
        .theme-gba .result-name,
        .theme-gba .ranking-rank,
        .theme-gba .ranking-name,
        .theme-gba .lcd-card-name { color: #2e4a24; }
        .theme-gba .title-wrap p,
        .theme-gba .gen-status { color: #47693a; }
        .theme-gba .lcd-header { border-bottom-color: #7fa66d; }
        .theme-gba .lcd-card { background: #ffffff; border-color: #2e4a24; }
        .theme-gba .lcd-card:active { background: #d9ecc9; }
        .theme-gba .skip-btn { border-color: #47693a; color: #47693a; }
        .theme-gba .skip-hint { color: #5a7d4c; }
        .theme-gba .gb-button,
        .theme-gba .back-btn {
          background: #2e4a24;
          color: #cfe8c8;
          box-shadow: 0 3px 0 #172a12;
        }
        .theme-gba .mode-btn { background: #ffffff; color: #47693a; border-color: #47693a; }
        .theme-gba .mode-btn.active { background: #2e4a24; color: #cfe8c8; border-color: #2e4a24; }
        .theme-gba .gen-row { background: #ffffff; border-color: #47693a; color: #2e4a24; }
        .theme-gba .gen-row.selected { background: #2e4a24; color: #cfe8c8; }
        .theme-gba .gen-row.selected .gen-status { color: #cfe8c8; }
        .theme-gba .ranking-row { background: #ffffff; border-color: #2e4a24; }
        .theme-gba .gb-dpad::before,
        .theme-gba .gb-dpad::after { background: #1c1330; }
        .theme-gba .gb-ab-btn { background: #8a4fff; box-shadow: 0 3px 0 #5a2ec2; }

        /* ニンテンドーDS風テーマ(第四・五世代) */
        .theme-ds .gb-body {
          background: linear-gradient(160deg, #f4f6fa, #cfd6e2);
          border-radius: 20px 20px 44px 44px;
        }
        .theme-ds .gb-brand { color: #6a7386; }
        .theme-ds .gb-screen-bezel { background: #1a1d24; }
        .theme-ds .gb-screen {
          background: #ffffff;
          box-shadow: inset 0 0 0 3px #232733;
        }
        .theme-ds .gb-screen.flash::after { background: #232733; }
        .theme-ds .lcd-header,
        .theme-ds .title-wrap h1,
        .theme-ds .result-wrap h2,
        .theme-ds .result-name,
        .theme-ds .ranking-rank,
        .theme-ds .ranking-name,
        .theme-ds .lcd-card-name { color: #232733; }
        .theme-ds .title-wrap p,
        .theme-ds .gen-status { color: #545c6b; }
        .theme-ds .lcd-header { border-bottom-color: #b7bfcc; }
        .theme-ds .lcd-card { background: #f2f4f8; border-color: #232733; }
        .theme-ds .lcd-card:active { background: #dde2ea; }
        .theme-ds .skip-btn { border-color: #545c6b; color: #545c6b; }
        .theme-ds .skip-hint { color: #6a7386; }
        .theme-ds .gb-button,
        .theme-ds .back-btn {
          background: #232733;
          color: #ffffff;
          box-shadow: 0 3px 0 #101218;
        }
        .theme-ds .mode-btn { background: #f2f4f8; color: #545c6b; border-color: #545c6b; }
        .theme-ds .mode-btn.active { background: #232733; color: #ffffff; border-color: #232733; }
        .theme-ds .gen-row { background: #f2f4f8; border-color: #545c6b; color: #232733; }
        .theme-ds .gen-row.selected { background: #232733; color: #ffffff; }
        .theme-ds .gen-row.selected .gen-status { color: #ffffff; }
        .theme-ds .ranking-row { background: #f2f4f8; border-color: #232733; }
        .theme-ds .gb-dpad::before,
        .theme-ds .gb-dpad::after { background: #1a1d24; }
        .theme-ds .gb-ab span { background: #3daaff; box-shadow: 0 3px 0 #1c72c2; }

        .ds-hinge {
          height: 10px;
          margin: 4px 14px;
          background: linear-gradient(to bottom, #b9bfcc, #8f97a6);
          border-radius: 3px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
        }
        .ds-bottom-screen-bezel {
          background: #1a1d24;
          border-radius: 10px;
          padding: 10px 10px 12px;
          margin: 0 2px;
        }
        .ds-bottom-screen {
          background: #ffffff;
          border-radius: 4px;
          box-shadow: inset 0 0 0 3px #232733;
          min-height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
        }
        .ds-touch-label {
          font-family: 'DotGothic16', sans-serif;
          font-size: 10px;
          color: #9aa2b1;
          letter-spacing: 1px;
        }
        .ds-touch-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ds-touch-btn {
          font-family: 'DotGothic16', sans-serif;
          background: #eef0f4;
          color: #232733;
          border: 2px solid #232733;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 11px;
          letter-spacing: 0.5px;
          cursor: pointer;
        }
        .ds-touch-btn:active:not(:disabled) { background: #cfd6e2; }
        .ds-touch-btn:disabled { opacity: 0.4; cursor: default; }
        .ds-touch-primary {
          background: #232733;
          color: #ffffff;
        }
        .ds-touch-primary:active:not(:disabled) { background: #3daaff; }
        .ds-touch-deco {
          font-family: 'DotGothic16', sans-serif;
          font-size: 12px;
          color: #c3c8d1;
          letter-spacing: 1px;
        }

        /* ニンテンドー3DS風テーマ(第六・七世代) */
        .theme-3ds .gb-body {
          background: linear-gradient(160deg, #ff5a6e, #2e6bff);
          border-radius: 18px 18px 42px 42px;
        }
        .theme-3ds .gb-brand { color: #ffe4e8; }
        .theme-3ds .gb-screen-bezel { background: #14141c; }
        .theme-3ds .gb-screen {
          background: #ffffff;
          box-shadow: inset 0 0 0 3px #14141c;
        }
        .theme-3ds .gb-screen.flash::after { background: #14141c; }
        .theme-3ds .lcd-header,
        .theme-3ds .title-wrap h1,
        .theme-3ds .result-wrap h2,
        .theme-3ds .result-name,
        .theme-3ds .ranking-rank,
        .theme-3ds .ranking-name,
        .theme-3ds .lcd-card-name { color: #14141c; }
        .theme-3ds .title-wrap p,
        .theme-3ds .gen-status { color: #55586b; }
        .theme-3ds .lcd-header { border-bottom-color: #c7cad6; }
        .theme-3ds .lcd-card { background: #f4f5f9; border-color: #14141c; }
        .theme-3ds .lcd-card:active { background: #dcdfe8; }
        .theme-3ds .skip-btn { border-color: #55586b; color: #55586b; }
        .theme-3ds .skip-hint { color: #6d7086; }
        .theme-3ds .gb-button,
        .theme-3ds .back-btn {
          background: #14141c;
          color: #ffffff;
          box-shadow: 0 3px 0 #000000;
        }
        .theme-3ds .mode-btn { background: #f4f5f9; color: #55586b; border-color: #55586b; }
        .theme-3ds .mode-btn.active { background: #14141c; color: #ffffff; border-color: #14141c; }
        .theme-3ds .gen-row { background: #f4f5f9; border-color: #55586b; color: #14141c; }
        .theme-3ds .gen-row.selected { background: #14141c; color: #ffffff; }
        .theme-3ds .gen-row.selected .gen-status { color: #ffffff; }
        .theme-3ds .ranking-row { background: #f4f5f9; border-color: #14141c; }
        .theme-3ds .gb-dpad::before,
        .theme-3ds .gb-dpad::after { background: #14141c; }
        .theme-3ds .gb-ab span { background: #ff5a6e; box-shadow: 0 3px 0 #c2293e; }

        /* Nintendo Switch風テーマ(第八・九世代) */
        .theme-switch .gb-body {
          background: linear-gradient(160deg, #2b2b2b, #0f0f0f);
          border-radius: 14px 14px 30px 30px;
        }
        .theme-switch .gb-brand { color: #cfcfcf; }
        .theme-switch .gb-screen-bezel { background: #050505; }
        .theme-switch .gb-screen {
          background: #ffffff;
          box-shadow: inset 0 0 0 3px #050505;
        }
        .theme-switch .gb-screen.flash::after { background: #050505; }
        .theme-switch .lcd-header,
        .theme-switch .title-wrap h1,
        .theme-switch .result-wrap h2,
        .theme-switch .result-name,
        .theme-switch .ranking-rank,
        .theme-switch .ranking-name,
        .theme-switch .lcd-card-name { color: #1a1a1a; }
        .theme-switch .title-wrap p,
        .theme-switch .gen-status { color: #55555a; }
        .theme-switch .lcd-header { border-bottom-color: #cfcfcf; }
        .theme-switch .lcd-card { background: #f2f2f2; border-color: #1a1a1a; }
        .theme-switch .lcd-card:active { background: #dcdcdc; }
        .theme-switch .skip-btn { border-color: #55555a; color: #55555a; }
        .theme-switch .skip-hint { color: #6f6f74; }
        .theme-switch .gb-button,
        .theme-switch .back-btn {
          background: #1a1a1a;
          color: #ffffff;
          box-shadow: 0 3px 0 #000000;
        }
        .theme-switch .mode-btn { background: #f2f2f2; color: #55555a; border-color: #55555a; }
        .theme-switch .mode-btn.active { background: #1a1a1a; color: #ffffff; border-color: #1a1a1a; }
        .theme-switch .gen-row { background: #f2f2f2; border-color: #55555a; color: #1a1a1a; }
        .theme-switch .gen-row.selected { background: #1a1a1a; color: #ffffff; }
        .theme-switch .gen-row.selected .gen-status { color: #ffffff; }
        .theme-switch .ranking-row { background: #f2f2f2; border-color: #1a1a1a; }
        .theme-switch .gb-dpad::before,
        .theme-switch .gb-dpad::after { background: #050505; }
        .theme-switch .gb-ab span:first-child { background: #ff4554; box-shadow: 0 3px 0 #b8202c; }
        .theme-switch .gb-ab span:last-child { background: #00c3e3; box-shadow: 0 3px 0 #0089a3; }

        .gb-brand {
          font-family: 'DotGothic16', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          color: #5b5e50;
          text-align: right;
          padding-right: 6px;
          margin-bottom: 6px;
        }
        .gb-screen-bezel {
          background: #2b2b26;
          border-radius: 10px;
          padding: 14px 10px 18px;
          box-shadow: inset 0 3px 10px rgba(0,0,0,0.6);
        }
        .gb-screen {
          background: #9bbc0f;
          border-radius: 4px;
          min-height: 520px;
          padding: 12px 10px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: inset 0 0 0 3px #0f380f;
        }
        .gb-screen.flash::after {
          content: '';
          position: absolute; inset: 0;
          background: #0f380f;
          animation: flashfade 0.15s ease-out;
          pointer-events: none;
        }
        @keyframes flashfade { from { opacity: 0.85; } to { opacity: 0; } }

        .lcd-header {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 12px;
          letter-spacing: 1px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px dashed #306230;
          padding-bottom: 6px;
          margin-bottom: 8px;
        }
        .back-btn {
          font-family: 'DotGothic16', sans-serif;
          background: #0f380f;
          color: #9bbc0f;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 11px;
          letter-spacing: 1px;
          cursor: pointer;
        }
        .back-btn:disabled { opacity: 0.35; }

        .title-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 14px;
          padding: 10px 4px;
        }
        .title-wrap h1 {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 22px;
          line-height: 1.6;
          margin: 0;
        }
        .title-wrap p {
          color: #306230;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }
        .gen-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-height: 150px;
          overflow-y: auto;
          margin: 4px 0;
        }
        .gen-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #cfe0a0;
          border: 1px solid #306230;
          border-radius: 4px;
          padding: 5px 8px;
          font-family: 'DotGothic16', sans-serif;
          font-size: 10px;
          color: #0f380f;
          width: 100%;
          cursor: pointer;
        }
        .gen-row.ready:active { background: #b9d67a; }
        .gen-row.selected { background: #0f380f; color: #9bbc0f; }
        .gen-row.selected .gen-status { color: #9bbc0f; }
        .gen-num { flex: 0 0 auto; margin-right: 6px; }
        .gen-region { flex: 1; text-align: left; }
        .gen-status { flex: 0 0 auto; font-size: 9px; color: #306230; }

        .mode-toggle {
          display: flex;
          gap: 8px;
        }
        .mode-btn {
          font-family: 'DotGothic16', sans-serif;
          background: #cfe0a0;
          color: #306230;
          border: 2px solid #306230;
          border-radius: 6px;
          padding: 7px 12px;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
        }
        .mode-btn.active {
          background: #0f380f;
          color: #9bbc0f;
          border-color: #0f380f;
        }
        .gb-button {
          font-family: 'DotGothic16', sans-serif;
          background: #0f380f;
          color: #9bbc0f;
          border: none;
          border-radius: 6px;
          padding: 12px 28px;
          font-size: 15px;
          letter-spacing: 2px;
          cursor: pointer;
          box-shadow: 0 3px 0 #071c07;
        }
        .gb-button:active { transform: translateY(2px); box-shadow: 0 1px 0 #071c07; }

        .vs-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lcd-card {
          background: #cfe0a0;
          border: 2px solid #0f380f;
          border-radius: 8px;
          padding: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          animation: popin 0.2s ease-out both;
        }
        .lcd-card:active { background: #8bac0f; }
        @keyframes popin { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        .lcd-card-imgwrap {
          position: relative;
          width: 78px;
          height: 78px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          image-rendering: pixelated;
        }
        .lcd-card-imgwrap img { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 3px 2px rgba(15,56,15,0.35)); }
        .alt-form-badge {
          position: absolute;
          right: -4px;
          bottom: -4px;
          object-fit: contain;
          image-rendering: pixelated;
          filter: drop-shadow(0 2px 2px rgba(15,56,15,0.45));
          background: rgba(255,255,255,0.85);
          border-radius: 6px;
          border: 1px solid rgba(15,56,15,0.4);
          padding: 1px;
        }
        .lcd-fallback {
          font-family: 'DotGothic16', sans-serif;
          font-size: 32px;
          color: #306230;
        }
        .lcd-card-name {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 15px;
          letter-spacing: 1px;
          text-align: left;
        }

        .skip-btn {
          font-family: 'DotGothic16', sans-serif;
          background: transparent;
          border: 2px dashed #306230;
          color: #306230;
          border-radius: 6px;
          padding: 8px;
          font-size: 12px;
          letter-spacing: 1px;
          margin-top: 6px;
          cursor: pointer;
        }
        .skip-btn:active { background: rgba(48,98,48,0.15); }
        .skip-hint {
          font-family: 'DotGothic16', sans-serif;
          color: #4d6e4d;
          font-size: 10px;
          text-align: center;
          margin-top: 4px;
          letter-spacing: 0.5px;
        }

        .result-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
        }
        .crown { font-size: 30px; }
        .result-wrap h2 {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 14px;
          letter-spacing: 1px;
          margin: 0;
        }
        .result-img-wrap { position: relative; display: inline-block; width: 65%; }
        .result-img { width: 100%; filter: drop-shadow(0 6px 6px rgba(15,56,15,0.4)); }
        .result-img-wrap .alt-form-badge { right: -6%; bottom: -6%; }
        .result-name {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 26px;
          letter-spacing: 1px;
        }
        .result-btn-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .gb-button.small {
          padding: 9px 14px;
          font-size: 12px;
        }
        .wc-entry { margin-top: 6px; }

        .wc-hub {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .wc-desc {
          font-family: 'DotGothic16', sans-serif;
          color: #306230;
          font-size: 11px;
          line-height: 1.6;
          margin: 0;
        }
        .wc-battle {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ranking-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ranking-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ranking-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #cfe0a0;
          border: 2px solid #0f380f;
          border-radius: 6px;
          padding: 4px 8px;
        }
        .ranking-rank {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 14px;
          width: 22px;
          text-align: center;
          flex-shrink: 0;
        }
        .ranking-thumb {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ranking-thumb img, .ranking-thumb .lcd-fallback {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .ranking-name {
          font-family: 'DotGothic16', sans-serif;
          color: #0f380f;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .gb-dpad-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding: 0 6px;
        }
        .gb-dpad {
          width: 46px; height: 46px;
          position: relative;
        }
        .gb-dpad::before, .gb-dpad::after {
          content: '';
          position: absolute;
          background: #4a4d43;
          border-radius: 3px;
        }
        .gb-dpad::before { width: 100%; height: 34%; top: 33%; left: 0; }
        .gb-dpad::after { height: 100%; width: 34%; left: 33%; top: 0; }
        .gb-ab { display: flex; gap: 10px; transform: rotate(-18deg); }
        .gb-ab-btn {
          width: 26px; height: 26px; border-radius: 50%;
          background: #7a2f4a; box-shadow: 0 3px 0 #4d1c2e;
          border: none; padding: 0; margin: 0;
          font-family: 'DotGothic16', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .gb-b-btn:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 1px 0 #4d1c2e; }
        .gb-b-btn:disabled { opacity: 0.45; cursor: default; }
        .gb-a-btn { cursor: default; }

        /* DS/3DS: 十字配置のフェイスボタン */
        .face-buttons {
          position: relative;
          width: 62px;
          height: 62px;
        }
        .fb {
          position: absolute;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #7a2f4a;
          box-shadow: 0 3px 0 #4d1c2e;
        }
        .fb-x { top: 0; left: 21px; }
        .fb-y { top: 21px; left: 0; }
        .fb-a { top: 21px; left: 42px; }
        .fb-b { top: 42px; left: 21px; }
        .theme-ds .fb, .theme-3ds .fb { background: #3daaff; box-shadow: 0 3px 0 #1c72c2; }
        .theme-3ds .fb { background: #ff5a6e; box-shadow: 0 3px 0 #c2293e; }

        /* Switch: Joy-Con風の縦長コントローラー */
        .joycon-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 20px;
        }
        .joycon {
          flex: 1;
          height: 74px;
          border-radius: 16px;
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
          padding: 0 8px;
        }
        .joycon-l { background: #00c3e3; border-radius: 16px 6px 6px 16px; }
        .joycon-r { background: #ff4554; border-radius: 6px 16px 16px 6px; }
        .jc-stick {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(0,0,0,0.25);
          box-shadow: inset 0 2px 3px rgba(0,0,0,0.35);
          flex-shrink: 0;
        }
        .jc-small-btn {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: rgba(0,0,0,0.25);
          color: rgba(255,255,255,0.85);
          font-size: 8px;
          line-height: 12px;
          text-align: center;
          flex-shrink: 0;
        }
        .jc-cross {
          position: relative;
          width: 30px; height: 30px;
          flex-shrink: 0;
        }
        .jc-cross-part {
          position: absolute;
          background: rgba(0,0,0,0.3);
          border-radius: 2px;
        }
        .jc-cross-up, .jc-cross-down { width: 10px; height: 10px; left: 10px; }
        .jc-cross-left, .jc-cross-right { width: 10px; height: 10px; top: 10px; }
        .jc-cross-up { top: 0; }
        .jc-cross-down { top: 20px; }
        .jc-cross-left { left: 0; }
        .jc-cross-right { left: 20px; }
        .jc-diamond {
          position: relative;
          width: 34px; height: 34px;
          flex-shrink: 0;
        }
        .jc-dbtn {
          position: absolute;
          width: 15px; height: 15px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          color: rgba(255,255,255,0.9);
          font-size: 8px;
          line-height: 15px;
          text-align: center;
        }
        .jc-x { top: 0; left: 9px; }
        .jc-y { top: 9px; left: 0; }
        .jc-a { top: 9px; left: 19px; }
        .jc-b { top: 19px; left: 9px; }
      `}</style>

      <div className="gb-body">
        <div className="gb-brand">POKÉ・LCD</div>
        <div className="gb-screen-bezel">
          <div className={`gb-screen${flash ? " flash" : ""}`}>
            {phase === "title" && (
              <div className="title-wrap">
                <h1>すきなポケモンは？</h1>
                <p>
                  3択で出てくるポケモンから好きな1匹を選び続けて、
                  <br />
                  あなたの一番好きな1匹を決めよう。
                </p>
                <div className="gen-list">
                  {GENERATIONS.map((g) => (
                    <button
                      key={g.gen}
                      onClick={() => setSelectedGen(g.gen)}
                      className={`gen-row ready${
                        g.gen === selectedGen ? " selected" : ""
                      }`}
                    >
                      <span className="gen-num">第{g.gen}世代</span>
                      <span className="gen-region">{g.region}</span>
                      <span className="gen-status">
                        {g.gen === selectedGen ? "選択中" : `${g.count}匹`}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mode-toggle">
                  <button
                    className={`mode-btn${mode === "all" ? " active" : ""}`}
                    onClick={() => setMode("all")}
                  >
                    全{GENERATIONS.find((g) => g.gen === selectedGen)?.count}匹
                  </button>
                  <button
                    className={`mode-btn${mode === "final" ? " active" : ""}`}
                    onClick={() => setMode("final")}
                  >
                    最終進化のみ
                  </button>
                </div>
                <button className="gb-button" onClick={start}>
                  スタート({GENERATIONS.find((g) => g.gen === selectedGen)?.region})
                </button>
                <button className="gb-button small wc-entry" onClick={openWcHub}>
                  🏆 ワールドカップ
                </button>
              </div>
            )}

            {phase === "wc" && wcPhase === "hub" && (
              <div className="wc-hub">
                <div className="lcd-header">
                  <button className="back-btn" onClick={() => setPhase("title")}>
                    ◀ もどる
                  </button>
                  <span>ワールドカップ ({wcDoneCount}/9)</span>
                </div>
                <p className="wc-desc">
                  各地方の予選を遊んで代表を選出しよう。9地方すべて終わると決勝ラウンドが解禁される。
                </p>
                <div className="gen-list">
                  {GENERATIONS.map((g) => {
                    const done = wcReps[g.gen] && wcReps[g.gen].length > 0;
                    return (
                      <button
                        key={g.gen}
                        className={`gen-row ready${done ? " selected" : ""}`}
                        onClick={() => startWcPrelim(g.gen)}
                      >
                        <span className="gen-num">第{g.gen}世代</span>
                        <span className="gen-region">{g.region}</span>
                        <span className="gen-status">
                          {done ? `代表${g.repSlots}匹決定` : "未選出"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  className="gb-button"
                  disabled={!wcAllRepsReady}
                  onClick={startGroupStage}
                  style={!wcAllRepsReady ? { opacity: 0.4 } : undefined}
                >
                  決勝ラウンドへ(32匹)
                </button>
              </div>
            )}

            {phase === "wc" && wcPhase === "group" && wcGroups[wcGroupIndex] && (
              <div className="wc-battle">
                <div className="lcd-header">
                  <span>
                    グループ {wcGroupIndex + 1}/8 ・ 第{wcMatchIndex + 1}/6試合
                  </span>
                </div>
                <div className="vs-wrap">
                  {(() => {
                    const [ai, bi] = buildRoundRobinPairs()[wcMatchIndex];
                    const group = wcGroups[wcGroupIndex];
                    return (
                      <>
                        <PokemonCard mon={group[ai]} onPick={handleGroupPick} />
                        <div className="vs-divider">▲ VS ▼</div>
                        <PokemonCard mon={group[bi]} onPick={handleGroupPick} />
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {phase === "wc" && wcPhase === "knockout" && wcBracket.length > 0 && (
              <div className="wc-battle">
                <div className="lcd-header">
                  <span>{wcRoundLabel}</span>
                </div>
                <div className="vs-wrap">
                  <PokemonCard mon={wcBracket[wcBracketIndex]} onPick={handleKnockoutPick} />
                  <div className="vs-divider">▲ VS ▼</div>
                  <PokemonCard mon={wcBracket[wcBracketIndex + 1]} onPick={handleKnockoutPick} />
                </div>
              </div>
            )}

            {phase === "wc" && wcPhase === "champion" && wcChampion && (
              <div className="result-wrap">
                <div className="crown">🏆</div>
                <h2>ワールドチャンピオンは…</h2>
                <ResultImage mon={wcChampion} />
                <div className="result-name">{wcChampion.name}</div>
                <button className="gb-button small" onClick={openWcHub}>
                  ハブへ戻る
                </button>
                <button className="gb-button small" onClick={goToTitle}>
                  メインメニューへ
                </button>
              </div>
            )}

            {phase === "battle" && options.length > 1 && (
              <>
                <div className="lcd-header">
                  <button
                    className="back-btn"
                    onClick={handleBack}
                    disabled={history.length === 0}
                  >
                    ◀ もどる
                  </button>
                  <span>
                    ROUND {roundNum}　{pairsDone + 1}／{pairsThisRound}
                  </span>
                </div>
                <div className="vs-wrap">
                  {options.map((mon) => (
                    <PokemonCard key={mon.id} mon={mon} onPick={handlePick} />
                  ))}
                </div>
                <button className="skip-btn" onClick={handleSkip}>
                  どれも好きじゃない
                </button>
                <div className="skip-hint">→ この3匹はここで対象から外れるよ</div>
              </>
            )}

            {phase === "result" && winner && (
              <div className="result-wrap">
                <div className="crown">👑</div>
                <h2>あなたの一番好きなポケモンは…</h2>
                <ResultImage mon={winner} />
                <div className="result-name">{winner.name}</div>
                {wcActiveGen ? (
                  <div className="result-btn-row">
                    <button className="gb-button small" onClick={() => setPhase("ranking")}>
                      ランキングを見る
                    </button>
                    <button className="gb-button small" onClick={saveWcRep}>
                      代表を保存してW杯へ
                    </button>
                  </div>
                ) : (
                  <div className="result-btn-row">
                    <button className="gb-button small" onClick={() => setPhase("ranking")}>
                      ランキングを見る
                    </button>
                    <button className="gb-button small" onClick={start}>
                      もう一度あそぶ
                    </button>
                  </div>
                )}
                <button className="gb-button small" onClick={goToTitle}>
                  メインメニューへ
                </button>
              </div>
            )}

            {phase === "ranking" && winner && (
              <div className="ranking-wrap">
                <div className="lcd-header">
                  <button className="back-btn" onClick={() => setPhase("result")}>
                    ◀ もどる
                  </button>
                  <span>好きなポケモン ランキング</span>
                </div>
                <div className="ranking-list">
                  {ranking.map((mon, i) => (
                    <div className="ranking-row" key={mon.id + "-" + i}>
                      <div className="ranking-rank">{i + 1}</div>
                      <div className="ranking-thumb">
                        <ResultImage mon={mon} />
                      </div>
                      <div className="ranking-name">{mon.name}</div>
                    </div>
                  ))}
                </div>
                <button className="gb-button small" onClick={start}>
                  もう一度あそぶ
                </button>
                <button className="gb-button small" onClick={goToTitle}>
                  メインメニューへ
                </button>
              </div>
            )}
          </div>
        </div>
        {currentTheme === "ds" && (
          <div className="ds-hinge" />
        )}
        {currentTheme === "ds" && (
          <div className="ds-bottom-screen-bezel">
            <div className="ds-bottom-screen">
              {phase === "title" && (
                <>
                  <div className="ds-touch-label">タッチスクリーン</div>
                  <button className="ds-touch-btn ds-touch-primary" onClick={start}>
                    ▶ スタート
                  </button>
                </>
              )}
              {phase === "battle" && (
                <>
                  <div className="ds-touch-label">タッチスクリーン</div>
                  <div className="ds-touch-row">
                    <button
                      className="ds-touch-btn"
                      onClick={handleBack}
                      disabled={history.length === 0}
                    >
                      ◀ もどる
                    </button>
                    <button className="ds-touch-btn" onClick={handleSkip}>
                      ✕ どれも好きじゃない
                    </button>
                  </div>
                </>
              )}
              {phase === "result" && (
                <>
                  <div className="ds-touch-label">タッチスクリーン</div>
                  <div className="ds-touch-row">
                    <button className="ds-touch-btn" onClick={() => setPhase("ranking")}>
                      ランキング
                    </button>
                    {wcActiveGen ? (
                      <button className="ds-touch-btn ds-touch-primary" onClick={saveWcRep}>
                        代表を保存
                      </button>
                    ) : (
                      <button className="ds-touch-btn ds-touch-primary" onClick={start}>
                        もう一度
                      </button>
                    )}
                  </div>
                  <button className="ds-touch-btn" onClick={goToTitle}>
                    ■ メインメニューへ
                  </button>
                </>
              )}
              {phase === "ranking" && (
                <>
                  <div className="ds-touch-label">タッチスクリーン</div>
                  <div className="ds-touch-row">
                    <button className="ds-touch-btn" onClick={() => setPhase("result")}>
                      ◀ もどる
                    </button>
                    <button className="ds-touch-btn ds-touch-primary" onClick={start}>
                      もう一度
                    </button>
                  </div>
                  <button className="ds-touch-btn" onClick={goToTitle}>
                    ■ メインメニューへ
                  </button>
                </>
              )}
              {phase === "wc" && wcPhase === "hub" && (
                <>
                  <div className="ds-touch-label">タッチスクリーン</div>
                  <button
                    className="ds-touch-btn ds-touch-primary"
                    onClick={startGroupStage}
                    disabled={!wcAllRepsReady}
                  >
                    ▶ 決勝ラウンドへ
                  </button>
                  <button className="ds-touch-btn" onClick={goToTitle}>
                    ■ メインメニューへ
                  </button>
                </>
              )}
              {phase === "wc" && (wcPhase === "group" || wcPhase === "knockout") && (
                <div className="ds-touch-deco">✎ タッチスクリーン</div>
              )}
              {phase === "wc" && wcPhase === "champion" && (
                <>
                  <div className="ds-touch-label">タッチスクリーン</div>
                  <div className="ds-touch-row">
                    <button className="ds-touch-btn" onClick={openWcHub}>
                      ハブへ
                    </button>
                    <button className="ds-touch-btn ds-touch-primary" onClick={goToTitle}>
                      メインメニューへ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {currentTheme === "switch" ? (
          <div className="joycon-row">
            <div className="joycon joycon-l">
              <span className="jc-small-btn jc-capture">◻</span>
              <div className="jc-cross">
                <span className="jc-cross-part jc-cross-up" />
                <span className="jc-cross-part jc-cross-down" />
                <span className="jc-cross-part jc-cross-left" />
                <span className="jc-cross-part jc-cross-right" />
              </div>
              <span className="jc-stick" />
              <span className="jc-small-btn jc-minus">−</span>
            </div>
            <div className="joycon joycon-r">
              <span className="jc-small-btn jc-home">⌂</span>
              <div className="jc-diamond">
                <span className="jc-dbtn jc-x">X</span>
                <span className="jc-dbtn jc-y">Y</span>
                <span className="jc-dbtn jc-a">A</span>
                <span className="jc-dbtn jc-b">B</span>
              </div>
              <span className="jc-stick" />
              <span className="jc-small-btn jc-plus">＋</span>
            </div>
          </div>
        ) : currentTheme === "ds" || currentTheme === "3ds" ? (
          <div className="gb-dpad-row">
            <div className="gb-dpad" />
            <div className="face-buttons">
              <span className="fb fb-x" />
              <span className="fb fb-y" />
              <span className="fb fb-a" />
              <span className="fb fb-b" />
            </div>
          </div>
        ) : (
          <div className="gb-dpad-row">
            <div className="gb-dpad" />
            <div className="gb-ab">
              <button
                type="button"
                className="gb-ab-btn gb-b-btn"
                onClick={handleBack}
                disabled={phase !== "battle" || history.length === 0}
                aria-label="もどる"
              >
                B
              </button>
              <span className="gb-ab-btn gb-a-btn" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
