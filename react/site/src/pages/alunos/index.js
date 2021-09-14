import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'
import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'

import { Container, Conteudo } from './styled'

import Api from '../../service/api'
import { useEffect, useState, useRef } from 'react';
const api = new Api();


export default function Index() {

    const [alunos, SetAlunos] = useState([]);
    const [nome, SetNome] = useState('');
    const [chamada, SetChamada] = useState('');
    const [turma, SetTurma] = useState('');
    const [curso, SetCurso] = useState('');
    const [idAlterando, SetIdalterando] = useState(0);
    const loading = useRef(null);


    async function listar(){
        
        let r = await api.listar();
        SetAlunos(r);
    }
 
    async function inserir(){
        loading.current.continuousStart();
        if(idAlterando === 0){
            if (nome === "" || chamada === "" || curso === "" || turma === "")
            toast.dark("Há campos obrigatórios vazios")
            else{

                if(chamada <= 0)
                toast.dark("A chamada deve ser positiva")
                else{

                    let validar = await api.listar();
                    console.log()

                    let r = await api.inserir(nome, chamada, curso, turma);
                    if(r.erro) 
                    toast(r.erro)
                    else 
                    toast("aluno inserido!"); 
                    

                    
                }
            }
        } else {
            let r = await api.alterar(idAlterando, nome, chamada, curso, turma);
            toast('dados alterados')
          
        }
        loading.current.complete();
        listar()
        limparcampos()
    }

    function limparcampos(){        
        SetNome('');
        SetChamada('');
        SetCurso('');
        SetTurma('');
        SetIdalterando(0);
    }

    async function remover(id){
        let r = await api.remover(id);
        toast ("aluno removido");
        listar();
    }

    async function editar(item){
        SetNome(item.nm_aluno);
        SetChamada(item.nr_chamada);
        SetCurso(item.nm_curso);
        SetTurma(item.nm_turma);
        SetIdalterando(item.id_matricula);
    }


    useEffect(() => 
        listar()
    , [])

    return (
        <Container>
            <ToastContainer/>
            <LoadingBar color='#986CDF' ref={loading}/>
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div classNameName="body-right-box">
                    <div className="new-student-box">
                        
                        <div className="text-new-student">
                            <div className="bar-new-student"></div>
                            <div className="text-new-student"> {idAlterando === 0 ? "Novo Aluno" : "Alterando aluno " + nome}</div>
                        </div>

                        <div className="input-new-student"> 
                            <div className="input-left">
                                <div className="agp-input"> 
                                    <div className="name-student"> Nome: </div>  
                                    <div className="input"> <input type="text" value={nome} onChange={e => SetNome(e.target.value)}/> </div>  
                                </div> 
                                <div className="agp-input">
                                    <div className="number-student"> Chamada: </div>  
                                    <div className="input"> <input type="text" value={chamada} onChange={e => SetChamada(e.target.value)} /> </div> 
                                </div>
                            </div>

                            <div className="input-right">
                                <div className="agp-input">
                                    <div className="corse-student"> Curso: </div>  
                                    <div className="input"> <input type="text" value={curso} onChange={e => SetCurso(e.target.value)} /> </div>  
                                </div>
                                <div className="agp-input">
                                    <div className="class-student"> Turma: </div>  
                                    <div className="input"> <input type="text" value={turma} onChange={e => SetTurma(e.target.value)}/> </div> 
                                </div>
                            </div>
                            <div className="button-create"> <button onClick={inserir}> {idAlterando === 0 ? "Cadastrar" : "Alterar"} </button> </div>
                        </div>
                    </div>

                    <div className="student-registered-box">
                        <div className="row-bar"> 
                            <div className="bar-new-student"> </div>
                            <div className="text-registered-student"> Alunos Matriculados </div>
                        </div>
                    
                        <table className ="table-user">
                            <thead>
                                <tr>
                                    <th> ID </th>
                                    <th> Nome </th>
                                    <th> Chamada </th>
                                    <th> Turma </th>
                                    <th> Curso </th>
                                    <th className="coluna-acao"> </th>
                                    <th className="coluna-acao"> </th>
                                </tr>
                            </thead>
                    
                            <tbody>

                                {alunos.map((item, i)  => 

                                    <tr className={i % 2 === 0 ? "linha-alternada" : ""}>
                                        <td> {item.id_matricula} </td>
                                        <td title={item.nm_aluno}> {item.nm_aluno != null && item.nm_aluno.length >= 25 ? item.nm_aluno.substr(0,25) + "..." : item.nm_aluno} </td>
                                        <td> {item.nr_chamada}  </td>
                                        <td> {item.nm_turma}  </td>
                                        <td> {item.nm_curso}  </td>
                                        <td className="coluna-acao"> <button onClick={() => editar(item)}> <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                        <td className="coluna-acao"> <button onClick={() => remover(item.id_matricula) }> <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                    </tr>

                                )}
                                                  
                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
