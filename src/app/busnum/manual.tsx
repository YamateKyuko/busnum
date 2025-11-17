export function KeioBusManual() {
  return (
    // <li>
      <details>
        <summary>
          京王バス
        </summary>
        数字 3・5 桁でお願いします。<br />
        アルファベット(営業所記号)は省略してください。<br />
        車番はバスの各所に配されています。<br />
        一例です。YNNもしくはMYYNNでご入力ください。
        <dl>
          <dt>前面・OYNN</dt>
          <dd>右ヘッドライトの上もしくは左</dd>
          <dt>左面・OMYYNN</dt>
          <dd>窓の右下端もしくはその下</dd>
          <dt>右面・OMYYNN</dt>
          <dd>窓の下左端</dd>
          <dt>背面・YNN</dt>
          <dd>テールランプ周辺</dd>
          <dt>天面・MYYNN</dt>
          <dd>中央</dd>
        </dl>
        <dl>
          <dt>O・営業所</dt>
          <dt>M・メーカ</dt>
          <dt>YY・導入年下二桁</dt>
          <dt>NN・固有番号</dt>
        </dl>
      </details>
    // </li>
  )
}

export function ToeiBusManual() {
  return (
    // <li>
      <details>
        <summary>
          都営バス
        </summary>
        アルファベット + 数字3桁で入力してください。<br />
        最初のアルファベット(営業所記号)は省略してください。<br />
        車番はバスの各所に配されています。<br />
        一例です。YNNNでご入力ください。
        <dl>
          <dt>前面・YNNN</dt>
          <dd>右ヘッドライトの上もしくは左</dd>
          <dt>左面・O-YNNN</dt>
          <dd>窓の右下端もしくはその下</dd>
          <dt>右面・O-YNNN</dt>
          <dd>窓の下左端</dd>
          <dt>背面・YNNN</dt>
          <dd>テールランプ周辺</dd>
          <dt>天面・YNNN</dt>
          <dd>中央下部</dd>
        </dl>
        <dl>
          <dt>O・営業所</dt>
          <dt>Y・導入年アルファベット1桁</dt>
          <dt>NNN・固有番号</dt>
        </dl>
      </details>
    // </li>
  )
}