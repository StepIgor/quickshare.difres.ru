import "./CSS/App.css"
import {useEffect, useState} from "react";


function App() {

    const [id, setId] = useState('');
    const [userId, setUserId] = useState();
    const [invalidIdBool, setInvalidIdBool] = useState(false);
    const [fileWasFoundBool, setFileWasFoundBool] = useState();
    const [connectionErrorBool, setConnectionErrorBool] = useState(false);

    useEffect(() => {
        parseFileIdFromUrl();
        window.addEventListener('popstate', (e) => {
            parseFileIdFromUrl();
        });
    }, []);

    useEffect(() => {
        if (id == null || id.toString().length < 1) return;
        setFileWasFoundBool(null);
        fetch('/share/' + id, {
            method: 'GET'
        }).then(res => {
            if (res.status != 200){
                setFileWasFoundBool(false);
                setConnectionErrorBool(false);
            } else {
                setFileWasFoundBool(true);
                setConnectionErrorBool(false);
            }
        }).catch((e) => {
            setConnectionErrorBool(true);
        })
    }, [id])

    function parseFileIdFromUrl(){
        let parts = window.location.href.split('/').filter(p => p != '' && p.indexOf(':') == -1);
        if (parts.length > 0) {
            setId(parts[0])
        } else {
            setId('')
        }
    }

    function findTheFileById() {
        if (userId.replace(/ /g, '').length > 0) {
            if (/^[а-яА-Я0-9A-Za-z_\-\.]+$/.test(userId) == false) {
                setInvalidIdBool(true);
                return
            }
            setId(userId);
            window.history.pushState(null, null, '/' + userId.toString());
        }
    }

    return (
        <div className={`container`}>
            <div className={`logo-container`} onClick={() => {setId('')}}>
                <i className={`material-icons`}>share</i>
                <span>QUICK SHARE</span>
            </div>
            <div className={`btn-input-container`}>
                {
                    id == '' &&
                    <div className={`id-input-container`}>
                        <input type="text" maxLength={128} placeholder="Введите ID файла" onChange={(e) => {
                            setUserId(e.target.value);
                            setInvalidIdBool(false);
                        }}
                               onKeyDown={(e) => {
                                   if (e.key.toString().toLowerCase() == 'enter') {
                                       findTheFileById();
                                   }
                               }
                               }
                        />
                        <button onClick={() => {
                            findTheFileById()
                        }}>Найти
                        </button>
                    </div>
                }
                {
                    (id == '' && invalidIdBool == true) &&
                    <div className={`invalid-warn`}>
                        ID содержит недопустимые символы
                    </div>
                }
                {
                    id != '' &&
                    <div className={`file-link-container`}>
                        {
                            (fileWasFoundBool == null && connectionErrorBool == false) &&
                            <div className={`search-status-label`}>
                                Выполняется поиск...
                            </div>
                        }
                        {
                            fileWasFoundBool == false &&
                            <div className={`search-status-label`}>
                                Файл не найден
                            </div>
                        }
                        {
                            connectionErrorBool == true &&
                            <div className={`search-status-label`}>
                                Нет подключения к сети
                            </div>
                        }
                        {
                            (fileWasFoundBool == true && connectionErrorBool == false) &&
                            <div className={`direct-link-result-container`}>
                                <span>{id}</span>
                                <a download href={`/share/${id}`}>Скачать</a>
                            </div>
                        }
                    </div>
                }
            </div>
            <div className={`about-container`}>
                <a className={`author-website-link`} href="https://www.stepigor.ru" target="_blank">
                    www.stepigor.ru
                </a>
            </div>
        </div>
    );
}

export default App;
