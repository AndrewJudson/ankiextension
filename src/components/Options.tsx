import React, { useEffect } from 'react';

interface OptionsPrompts {
    storage: {
      get: (keys: string | string[] | { [key: string]: any } | null, callback: (items: { [key: string]: any }) => void) => void;
      set: (items: { [key: string]: any }, callback?: () => void) => void
    }
}

const ANKI = 'ANKI';
const MOCHI = 'MOCHI';

function Options({storage}: OptionsPrompts) {
  const [apiKey, setApiKey] = React.useState<string>('');
  const [ankiKey, setAnkiKey] = React.useState<string>('');
  const [ankiDeck, setAnkiDeck] = React.useState<string>('');
  const [mochiKey, setMochiKey] = React.useState<string>('');
  const [mochiDeck, setMochiDeck] = React.useState<string>('');
  const [appSelection, setApp] = React.useState<string>(ANKI);
  const [saveButtonText, setSaveButtonText] = React.useState<string>('Save');
  const [clearButtonText, setClearButtonText] = React.useState<string>('Clear');
  // Load saved keys, if they exists.
  useEffect(() => {
    storage.get({
      apiKey: '',
      appSelection: ANKI,
      ankiKey: '',
      ankiDeck: '',
      mochiKey: '',
      mochiDeck: '',
    }, function (items) {
      setApiKey(items.apiKey);
      setApp(items.appSelection);
      setAnkiKey(items.ankiKey);
      setAnkiDeck(items.ankiDeck);
      setMochiKey(items.mochiKey);
      setMochiDeck(items.mochiDeck);
    });
  }, []);

  function generateStateChangeHandler(setter) {
    return function (event: React.ChangeEvent<HTMLInputElement>) {
      setter(event.target.value);
    }
  }

  function save() {
    // if ((apiKey === '' || (mochiKey === '' || mochiDeck === '') || (ankiKey === '' || ankiDeck === '')) {
    if (apiKey !== '' && ((mochiKey !== '' && mochiDeck !== '') || (ankiKey !== '' && ankiDeck !== ''))) {
      storage.set({
        apiKey: apiKey,
        appSelection: appSelection,
        ankiKey: ankiKey,
        ankiDeck: ankiDeck,
        mochiKey: mochiKey,
        mochiDeck: mochiDeck,
      }, function () {
        // Update status to let user know options were saved.
        setSaveButtonText('Options saved');
        setTimeout(function () {
          setSaveButtonText('Save');
        }, 750);
      })
    } else {
      setSaveButtonText('Please fill out all fields');
      return;
    }
  }

  function clear() {
    storage.set({
      apiKey: "",
      ankiKey: "",
      ankiDeck: "",
      mochiKey: "",
      mochiDeck: "",
    }, function () {
      // Update status to let user know options were saved.
      setApiKey("");
      setAnkiKey("");
      setAnkiDeck("");
      setMochiKey("");
      setMochiDeck("");
      setClearButtonText('Settings cleared');
      setTimeout(function () {
        setClearButtonText('Clear');
      }, 750);
    })
  }

  function setterElement(state, setter, title) {
    return <div className="flex flex-col pb-3 items-center">
    <p className="pr-2">{title}</p>
    <input className="flex border-2 rounded-md px-1 justify-self-end grow" value={state} onChange={generateStateChangeHandler(setter)}></input>
  </div>
  }

  return <div className="flex flex-col p-2 w-fit">
    {setterElement(apiKey, setApiKey, "Open AI API Key")}
    <div>
      <input type="radio" name="app" className="m-2"
       onChange={function(event) { if (event.target.value === 'on') { setApp(ANKI) }}} checked={appSelection === ANKI}/>
      <label for="app">Anki</label>
    </div>
    <div>
      <input type="radio" name="app" className="m-2"
       onChange={function(event) { if (event.target.value === 'on') { setApp(MOCHI) }}} check={appSelection === MOCHI}/>
      <label for="app">Mochi</label>
    </div>
    {appSelection === ANKI && setterElement(ankiKey, setAnkiKey, "Anki API Key")}
    {appSelection === ANKI && setterElement(ankiDeck, setAnkiDeck, "Anki Deck")}
    {appSelection === MOCHI && setterElement(mochiKey, setMochiKey, "Mochi API Key")}
    {appSelection === MOCHI && setterElement(mochiDeck, setMochiDeck, "Mochi Deck ID")}
    <button className="flex items-center justify-center mt-2 mb-2 border-2 rounded-md hover:bg-sky-200 bg-slate-300 px-1" onClick={save}>{saveButtonText}</button>
    <button className="flex items-center justify-center mt-2 mb-2 border-2 rounded-md hover:bg-sky-200 bg-red-300 px-1" onClick={clear}>{clearButtonText}</button>
  </div>;
};

export default Options;
