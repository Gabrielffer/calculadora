
import './App.css';
import './dispMoveis.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {useState, useRef} from 'react';

function App(){
  const botoes = [
    {
      id: 'clear',
      valor: 'AC',
      indice: 0,
      classe: 'btn btn-danger'
    },
    {
      id: 'divide',
      valor: '/',
      indice: 1,
      classe: 'btn btn-info'
    },
    {
      id: 'multiply',
      valor: '*',
      indice: 2,
      classe: 'btn btn-info'
    },
    {
      id: 'subtract',
      valor: '-',
      indice: 3,
      classe: 'btn btn-info'
    },
    {
      id: 'add',
      valor: '+',
      indice: 4,
      classe: 'btn btn-info'
    },
    {
      id: 'four',
      valor: '4',
      indice: 8,
      classe: 'btn btn-success'
    },
    {
      id: 'five',
      valor: '5',
      indice: 9,
      classe: 'btn btn-success'
    },
    {
      id: 'six',
      valor: '6',
      indice: 10,
      classe: 'btn btn-success'
    },
    {
      id: 'seven',
      valor: '7',
      indice: 5,
      classe: 'btn btn-success'
    },
    {
      id: 'eight',
      valor: '8',
      indice: 6,
      classe: 'btn btn-success'
    },
    {
      id: 'nine',
      valor: '9',
      indice: 7,
      classe: 'btn btn-success'
    },
    {
      id: 'zero',
      valor: '0',
      indice: 14,
      classe: 'btn btn-success'
    },
    {
      id: 'one',
      valor: '1',
      indice: 11,
      classe: 'btn btn-success'
    },
    {
      id: 'two',
      valor: '2',
      indice: 12,
      classe: 'btn btn-success'
    },
    {
      id: 'three',
      valor: '3',
      indice: 13,
      classe: 'btn btn-success'
    },
    {
      id: 'decimal',
      valor: '.',
      indice: 15,
      classe: 'btn btn-warning'
    },
    {
      id: 'equals',
      valor: '=',
      indice: 16,
      classe: 'btn btn-primary'
    }
  ];

  const [alerta, atualizarAlerta] = useState('');
  const [formula, atualizarFormula] = useState('----');
  const [exibicao, atualizarExibicao] = useState({
    entrada: '0'
  });
  const [historico, atualizarHistorico] = useState([]);

  const elementosRef = useRef([]);

  function sinalEspecial(valor, pular = ''){
    const operacoes = ['-', '+', '*', '/', '.'];
    let eSinal = false;
    for(let c = 0; c < operacoes.length; c++){
      if(pular !== ''){
        if(operacoes[c] === pular){
          continue;
        }
      }
      if(valor.includes(operacoes[c])){
        eSinal = true;
      }
    }
    return eSinal;
  }

  function tratarBotao(valor){
    if(valor === 'AC'){
      atualizarAlerta('');
      atualizarFormula('----');
      atualizarExibicao({
        entrada: '0'
      });
    }else if(valor === '='){
      if(!sinalEspecial(pegarUltCaractere(exibicao.entrada)) && sinalEspecial(exibicao.entrada, '.')){
        atualizarExibicao({
          entrada: calcular(exibicao.entrada)
        });
        atualizarFormula(exibicao.entrada);
      }
    }else{
      if(sinalEspecial(pegarUltCaractere(exibicao.entrada)) && sinalEspecial(valor)){
        atualizarExibicao(exibicaoAnterior => {
          if(pegarUltCaractere(exibicao.entrada) === '.' && valor === '.'){
            valor = '';
          }
          return {
            entrada: exibicaoAnterior.entrada + valor
          }
        });
      }else{
        if(exibicao.entrada === '0'){
          atualizarExibicao({
              entrada: valor
          });
        }else{
          let arrContas = exibicao.entrada.split(/[\/\*\-\+]/);
          const contaAtual = arrContas[arrContas.length-1];
          atualizarExibicao(exibicaoAnterior => {
            if(contaAtual.includes('.') && valor === '.'){
              valor = '';
              exibicaoAnterior.entrada = parseFloat(exibicaoAnterior.entrada);
            }
            return {
              entrada: exibicaoAnterior.entrada + valor
            }
          });
        }
      }
    }
  }

  function pegarUltCaractere(vlr){
    return vlr.charAt(vlr.length - 1);
  }

  function calcular(vlr){
    vlr = vlr.trim();
    vlr = vlr.replace(/\b0+(\d)/g, '$1');
    vlr = vlr.replace(/[^\d\+\-\*\/\(\)\.]/g, '');
    vlr = vlr.match(/(\*|\+|\/|-)?(\.|\-)?\d+/g).join('');
    const res = String(eval(vlr));
    atualizarHistorico([...historico, {conta: vlr, resultado: res}]);
    return res;
  }

  return (
    <div>
      <div id='calculadora'>
        <div className='container-fluid text-danger'>{alerta}</div>
        <div className='container-fluid bg-dark text-warning' id='formula'>{formula}</div>
        <div className='container-fluid bg-dark text-success' id='display'>{exibicao.entrada}</div>
        <div className='container-fluid bg-dark' id='botoes'>
          {botoes.map(obj => (
            <button key={obj.id}
                    id={obj.id}
                    className={obj.classe}
                    style={{borderRadius: 'none'}}
                    ref={(ref) => elementosRef.current[obj.indice] = ref}
                    onClick={() => tratarBotao(obj.valor)}>{obj.valor}</button>
          ))}
        </div>
      </div>
      {historico.length > 0 ? <Historico historico={historico}/> : ''}
    </div>
  );
}

function Historico({historico}){
  return (
    <div className='container bg-dark' id='historico'>
    {historico.map((obj, indice) => (
      <div key={indice} style={{marginTop: (indice > 0 ? '20px' : '')}}>
        <span className='text-secondary'>{obj.conta}</span>
        <span className='text-info'> = </span>
        <span className='text-warning'>{obj.resultado}</span>
      </div>
    ))}
    </div>
  );
}

export default App;