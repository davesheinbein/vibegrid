/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./src/components/ui/MultiplayerProvider.tsx":
/*!***************************************************!*\
  !*** ./src/components/ui/MultiplayerProvider.tsx ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MultiplayerProvider: () => (/* binding */ MultiplayerProvider),\n/* harmony export */   useMultiplayer: () => (/* binding */ useMultiplayer)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io-client */ \"socket.io-client\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_2__]);\nsocket_io_client__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nconst MultiplayerContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst useMultiplayer = ()=>{\n    const ctx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(MultiplayerContext);\n    if (!ctx) throw new Error('useMultiplayer must be used within MultiplayerProvider');\n    return ctx;\n};\nconst MultiplayerProvider = ({ children })=>{\n    const [socket, setSocket] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [roomCode, setRoomCode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isHost, setIsHost] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isConnected, setIsConnected] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [matchStarted, setMatchStarted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [opponentJoined, setOpponentJoined] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const socketRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"MultiplayerProvider.useEffect\": ()=>{\n            const s = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_2__.io)(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');\n            setSocket(s);\n            socketRef.current = s;\n            s.on('connect', {\n                \"MultiplayerProvider.useEffect\": ()=>setIsConnected(true)\n            }[\"MultiplayerProvider.useEffect\"]);\n            s.on('disconnect', {\n                \"MultiplayerProvider.useEffect\": ()=>setIsConnected(false)\n            }[\"MultiplayerProvider.useEffect\"]);\n            s.on('roomJoined', {\n                \"MultiplayerProvider.useEffect\": ({ roomCode, isHost })=>{\n                    setRoomCode(roomCode);\n                    setIsHost(isHost);\n                }\n            }[\"MultiplayerProvider.useEffect\"]);\n            s.on('opponentJoined', {\n                \"MultiplayerProvider.useEffect\": ()=>setOpponentJoined(true)\n            }[\"MultiplayerProvider.useEffect\"]);\n            s.on('startMatch', {\n                \"MultiplayerProvider.useEffect\": ()=>setMatchStarted(true)\n            }[\"MultiplayerProvider.useEffect\"]);\n            s.on('leftRoom', {\n                \"MultiplayerProvider.useEffect\": ()=>{\n                    setRoomCode(null);\n                    setIsHost(false);\n                    setOpponentJoined(false);\n                    setMatchStarted(false);\n                }\n            }[\"MultiplayerProvider.useEffect\"]);\n            return ({\n                \"MultiplayerProvider.useEffect\": ()=>{\n                    s.disconnect();\n                }\n            })[\"MultiplayerProvider.useEffect\"];\n        }\n    }[\"MultiplayerProvider.useEffect\"], []);\n    const createRoom = (code)=>{\n        socketRef.current?.emit('createRoom', {\n            roomCode: code\n        });\n        setIsHost(true);\n        setRoomCode(code);\n    };\n    const joinRoom = (code)=>{\n        socketRef.current?.emit('joinRoom', {\n            roomCode: code\n        });\n        setIsHost(false);\n        setRoomCode(code);\n    };\n    const leaveRoom = ()=>{\n        socketRef.current?.emit('leaveRoom');\n        setRoomCode(null);\n        setIsHost(false);\n        setOpponentJoined(false);\n        setMatchStarted(false);\n    };\n    const startMatch = ()=>{\n        socketRef.current?.emit('startMatch', {\n            roomCode\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(MultiplayerContext.Provider, {\n        value: {\n            socket,\n            roomCode,\n            isHost,\n            isConnected,\n            matchStarted,\n            opponentJoined,\n            setRoomCode,\n            createRoom,\n            joinRoom,\n            leaveRoom,\n            startMatch\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/davidsheinbein/code/vibe-grid/src/components/ui/MultiplayerProvider.tsx\",\n        lineNumber: 102,\n        columnNumber: 3\n    }, undefined);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb21wb25lbnRzL3VpL011bHRpcGxheWVyUHJvdmlkZXIudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBTWU7QUFDK0I7QUFpQjlDLE1BQU1PLG1DQUFxQk4sb0RBQWFBLENBRXRDTztBQUVLLE1BQU1DLGlCQUFpQjtJQUM3QixNQUFNQyxNQUFNUixpREFBVUEsQ0FBQ0s7SUFDdkIsSUFBSSxDQUFDRyxLQUNKLE1BQU0sSUFBSUMsTUFDVDtJQUVGLE9BQU9EO0FBQ1IsRUFBRTtBQUVLLE1BQU1FLHNCQUVSLENBQUMsRUFBRUMsUUFBUSxFQUFFO0lBQ2pCLE1BQU0sQ0FBQ0MsUUFBUUMsVUFBVSxHQUFHViwrQ0FBUUEsQ0FBZ0I7SUFDcEQsTUFBTSxDQUFDVyxVQUFVQyxZQUFZLEdBQUdaLCtDQUFRQSxDQUN2QztJQUVELE1BQU0sQ0FBQ2EsUUFBUUMsVUFBVSxHQUFHZCwrQ0FBUUEsQ0FBQztJQUNyQyxNQUFNLENBQUNlLGFBQWFDLGVBQWUsR0FBR2hCLCtDQUFRQSxDQUFDO0lBQy9DLE1BQU0sQ0FBQ2lCLGNBQWNDLGdCQUFnQixHQUFHbEIsK0NBQVFBLENBQUM7SUFDakQsTUFBTSxDQUFDbUIsZ0JBQWdCQyxrQkFBa0IsR0FDeENwQiwrQ0FBUUEsQ0FBQztJQUNWLE1BQU1xQixZQUFZdEIsNkNBQU1BLENBQWdCO0lBRXhDRCxnREFBU0E7eUNBQUM7WUFDVCxNQUFNd0IsSUFBSXJCLG9EQUFFQSxDQUNYc0IsUUFBUUMsR0FBRyxDQUFDQyxzQkFBc0IsSUFDakM7WUFFRmYsVUFBVVk7WUFDVkQsVUFBVUssT0FBTyxHQUFHSjtZQUNwQkEsRUFBRUssRUFBRSxDQUFDO2lEQUFXLElBQU1YLGVBQWU7O1lBQ3JDTSxFQUFFSyxFQUFFLENBQUM7aURBQWMsSUFBTVgsZUFBZTs7WUFDeENNLEVBQUVLLEVBQUUsQ0FBQztpREFBYyxDQUFDLEVBQUVoQixRQUFRLEVBQUVFLE1BQU0sRUFBRTtvQkFDdkNELFlBQVlEO29CQUNaRyxVQUFVRDtnQkFDWDs7WUFDQVMsRUFBRUssRUFBRSxDQUFDO2lEQUFrQixJQUFNUCxrQkFBa0I7O1lBQy9DRSxFQUFFSyxFQUFFLENBQUM7aURBQWMsSUFBTVQsZ0JBQWdCOztZQUN6Q0ksRUFBRUssRUFBRSxDQUFDO2lEQUFZO29CQUNoQmYsWUFBWTtvQkFDWkUsVUFBVTtvQkFDVk0sa0JBQWtCO29CQUNsQkYsZ0JBQWdCO2dCQUNqQjs7WUFDQTtpREFBTztvQkFDTkksRUFBRU0sVUFBVTtnQkFDYjs7UUFDRDt3Q0FBRyxFQUFFO0lBRUwsTUFBTUMsYUFBYSxDQUFDQztRQUNuQlQsVUFBVUssT0FBTyxFQUFFSyxLQUFLLGNBQWM7WUFDckNwQixVQUFVbUI7UUFDWDtRQUNBaEIsVUFBVTtRQUNWRixZQUFZa0I7SUFDYjtJQUNBLE1BQU1FLFdBQVcsQ0FBQ0Y7UUFDakJULFVBQVVLLE9BQU8sRUFBRUssS0FBSyxZQUFZO1lBQUVwQixVQUFVbUI7UUFBSztRQUNyRGhCLFVBQVU7UUFDVkYsWUFBWWtCO0lBQ2I7SUFDQSxNQUFNRyxZQUFZO1FBQ2pCWixVQUFVSyxPQUFPLEVBQUVLLEtBQUs7UUFDeEJuQixZQUFZO1FBQ1pFLFVBQVU7UUFDVk0sa0JBQWtCO1FBQ2xCRixnQkFBZ0I7SUFDakI7SUFDQSxNQUFNZ0IsYUFBYTtRQUNsQmIsVUFBVUssT0FBTyxFQUFFSyxLQUFLLGNBQWM7WUFBRXBCO1FBQVM7SUFDbEQ7SUFFQSxxQkFDQyw4REFBQ1QsbUJBQW1CaUMsUUFBUTtRQUMzQkMsT0FBTztZQUNOM0I7WUFDQUU7WUFDQUU7WUFDQUU7WUFDQUU7WUFDQUU7WUFDQVA7WUFDQWlCO1lBQ0FHO1lBQ0FDO1lBQ0FDO1FBQ0Q7a0JBRUMxQjs7Ozs7O0FBR0osRUFBRSIsInNvdXJjZXMiOlsiL1VzZXJzL2Rhdmlkc2hlaW5iZWluL2NvZGUvdmliZS1ncmlkL3NyYy9jb21wb25lbnRzL3VpL011bHRpcGxheWVyUHJvdmlkZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge1xuXHRjcmVhdGVDb250ZXh0LFxuXHR1c2VDb250ZXh0LFxuXHR1c2VFZmZlY3QsXG5cdHVzZVJlZixcblx0dXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlvLCBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuaW50ZXJmYWNlIE11bHRpcGxheWVyQ29udGV4dFR5cGUge1xuXHRzb2NrZXQ6IFNvY2tldCB8IG51bGw7XG5cdHJvb21Db2RlOiBzdHJpbmcgfCBudWxsO1xuXHRpc0hvc3Q6IGJvb2xlYW47XG5cdGlzQ29ubmVjdGVkOiBib29sZWFuO1xuXHRtYXRjaFN0YXJ0ZWQ6IGJvb2xlYW47XG5cdG9wcG9uZW50Sm9pbmVkOiBib29sZWFuO1xuXHRzZXRSb29tQ29kZTogKGNvZGU6IHN0cmluZyB8IG51bGwpID0+IHZvaWQ7XG5cdGNyZWF0ZVJvb206IChyb29tQ29kZTogc3RyaW5nKSA9PiB2b2lkO1xuXHRqb2luUm9vbTogKHJvb21Db2RlOiBzdHJpbmcpID0+IHZvaWQ7XG5cdGxlYXZlUm9vbTogKCkgPT4gdm9pZDtcblx0c3RhcnRNYXRjaDogKCkgPT4gdm9pZDtcblx0Ly8gQWRkIG1vcmUgbXVsdGlwbGF5ZXIgc3RhdGUvYWN0aW9ucyBhcyBuZWVkZWRcbn1cblxuY29uc3QgTXVsdGlwbGF5ZXJDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxcblx0TXVsdGlwbGF5ZXJDb250ZXh0VHlwZSB8IHVuZGVmaW5lZFxuPih1bmRlZmluZWQpO1xuXG5leHBvcnQgY29uc3QgdXNlTXVsdGlwbGF5ZXIgPSAoKSA9PiB7XG5cdGNvbnN0IGN0eCA9IHVzZUNvbnRleHQoTXVsdGlwbGF5ZXJDb250ZXh0KTtcblx0aWYgKCFjdHgpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0J3VzZU11bHRpcGxheWVyIG11c3QgYmUgdXNlZCB3aXRoaW4gTXVsdGlwbGF5ZXJQcm92aWRlcidcblx0XHQpO1xuXHRyZXR1cm4gY3R4O1xufTtcblxuZXhwb3J0IGNvbnN0IE11bHRpcGxheWVyUHJvdmlkZXI6IFJlYWN0LkZDPHtcblx0Y2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZTtcbn0+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuXHRjb25zdCBbc29ja2V0LCBzZXRTb2NrZXRdID0gdXNlU3RhdGU8U29ja2V0IHwgbnVsbD4obnVsbCk7XG5cdGNvbnN0IFtyb29tQ29kZSwgc2V0Um9vbUNvZGVdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4oXG5cdFx0bnVsbFxuXHQpO1xuXHRjb25zdCBbaXNIb3N0LCBzZXRJc0hvc3RdID0gdXNlU3RhdGUoZmFsc2UpO1xuXHRjb25zdCBbaXNDb25uZWN0ZWQsIHNldElzQ29ubmVjdGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblx0Y29uc3QgW21hdGNoU3RhcnRlZCwgc2V0TWF0Y2hTdGFydGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblx0Y29uc3QgW29wcG9uZW50Sm9pbmVkLCBzZXRPcHBvbmVudEpvaW5lZF0gPVxuXHRcdHVzZVN0YXRlKGZhbHNlKTtcblx0Y29uc3Qgc29ja2V0UmVmID0gdXNlUmVmPFNvY2tldCB8IG51bGw+KG51bGwpO1xuXG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0Y29uc3QgcyA9IGlvKFxuXHRcdFx0cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU09DS0VUX1VSTCB8fFxuXHRcdFx0XHQnaHR0cDovL2xvY2FsaG9zdDo0MDAwJ1xuXHRcdCk7XG5cdFx0c2V0U29ja2V0KHMpO1xuXHRcdHNvY2tldFJlZi5jdXJyZW50ID0gcztcblx0XHRzLm9uKCdjb25uZWN0JywgKCkgPT4gc2V0SXNDb25uZWN0ZWQodHJ1ZSkpO1xuXHRcdHMub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiBzZXRJc0Nvbm5lY3RlZChmYWxzZSkpO1xuXHRcdHMub24oJ3Jvb21Kb2luZWQnLCAoeyByb29tQ29kZSwgaXNIb3N0IH0pID0+IHtcblx0XHRcdHNldFJvb21Db2RlKHJvb21Db2RlKTtcblx0XHRcdHNldElzSG9zdChpc0hvc3QpO1xuXHRcdH0pO1xuXHRcdHMub24oJ29wcG9uZW50Sm9pbmVkJywgKCkgPT4gc2V0T3Bwb25lbnRKb2luZWQodHJ1ZSkpO1xuXHRcdHMub24oJ3N0YXJ0TWF0Y2gnLCAoKSA9PiBzZXRNYXRjaFN0YXJ0ZWQodHJ1ZSkpO1xuXHRcdHMub24oJ2xlZnRSb29tJywgKCkgPT4ge1xuXHRcdFx0c2V0Um9vbUNvZGUobnVsbCk7XG5cdFx0XHRzZXRJc0hvc3QoZmFsc2UpO1xuXHRcdFx0c2V0T3Bwb25lbnRKb2luZWQoZmFsc2UpO1xuXHRcdFx0c2V0TWF0Y2hTdGFydGVkKGZhbHNlKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0cy5kaXNjb25uZWN0KCk7XG5cdFx0fTtcblx0fSwgW10pO1xuXG5cdGNvbnN0IGNyZWF0ZVJvb20gPSAoY29kZTogc3RyaW5nKSA9PiB7XG5cdFx0c29ja2V0UmVmLmN1cnJlbnQ/LmVtaXQoJ2NyZWF0ZVJvb20nLCB7XG5cdFx0XHRyb29tQ29kZTogY29kZSxcblx0XHR9KTtcblx0XHRzZXRJc0hvc3QodHJ1ZSk7XG5cdFx0c2V0Um9vbUNvZGUoY29kZSk7XG5cdH07XG5cdGNvbnN0IGpvaW5Sb29tID0gKGNvZGU6IHN0cmluZykgPT4ge1xuXHRcdHNvY2tldFJlZi5jdXJyZW50Py5lbWl0KCdqb2luUm9vbScsIHsgcm9vbUNvZGU6IGNvZGUgfSk7XG5cdFx0c2V0SXNIb3N0KGZhbHNlKTtcblx0XHRzZXRSb29tQ29kZShjb2RlKTtcblx0fTtcblx0Y29uc3QgbGVhdmVSb29tID0gKCkgPT4ge1xuXHRcdHNvY2tldFJlZi5jdXJyZW50Py5lbWl0KCdsZWF2ZVJvb20nKTtcblx0XHRzZXRSb29tQ29kZShudWxsKTtcblx0XHRzZXRJc0hvc3QoZmFsc2UpO1xuXHRcdHNldE9wcG9uZW50Sm9pbmVkKGZhbHNlKTtcblx0XHRzZXRNYXRjaFN0YXJ0ZWQoZmFsc2UpO1xuXHR9O1xuXHRjb25zdCBzdGFydE1hdGNoID0gKCkgPT4ge1xuXHRcdHNvY2tldFJlZi5jdXJyZW50Py5lbWl0KCdzdGFydE1hdGNoJywgeyByb29tQ29kZSB9KTtcblx0fTtcblxuXHRyZXR1cm4gKFxuXHRcdDxNdWx0aXBsYXllckNvbnRleHQuUHJvdmlkZXJcblx0XHRcdHZhbHVlPXt7XG5cdFx0XHRcdHNvY2tldCxcblx0XHRcdFx0cm9vbUNvZGUsXG5cdFx0XHRcdGlzSG9zdCxcblx0XHRcdFx0aXNDb25uZWN0ZWQsXG5cdFx0XHRcdG1hdGNoU3RhcnRlZCxcblx0XHRcdFx0b3Bwb25lbnRKb2luZWQsXG5cdFx0XHRcdHNldFJvb21Db2RlLFxuXHRcdFx0XHRjcmVhdGVSb29tLFxuXHRcdFx0XHRqb2luUm9vbSxcblx0XHRcdFx0bGVhdmVSb29tLFxuXHRcdFx0XHRzdGFydE1hdGNoLFxuXHRcdFx0fX1cblx0XHQ+XG5cdFx0XHR7Y2hpbGRyZW59XG5cdFx0PC9NdWx0aXBsYXllckNvbnRleHQuUHJvdmlkZXI+XG5cdCk7XG59O1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsImlvIiwiTXVsdGlwbGF5ZXJDb250ZXh0IiwidW5kZWZpbmVkIiwidXNlTXVsdGlwbGF5ZXIiLCJjdHgiLCJFcnJvciIsIk11bHRpcGxheWVyUHJvdmlkZXIiLCJjaGlsZHJlbiIsInNvY2tldCIsInNldFNvY2tldCIsInJvb21Db2RlIiwic2V0Um9vbUNvZGUiLCJpc0hvc3QiLCJzZXRJc0hvc3QiLCJpc0Nvbm5lY3RlZCIsInNldElzQ29ubmVjdGVkIiwibWF0Y2hTdGFydGVkIiwic2V0TWF0Y2hTdGFydGVkIiwib3Bwb25lbnRKb2luZWQiLCJzZXRPcHBvbmVudEpvaW5lZCIsInNvY2tldFJlZiIsInMiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU09DS0VUX1VSTCIsImN1cnJlbnQiLCJvbiIsImRpc2Nvbm5lY3QiLCJjcmVhdGVSb29tIiwiY29kZSIsImVtaXQiLCJqb2luUm9vbSIsImxlYXZlUm9vbSIsInN0YXJ0TWF0Y2giLCJQcm92aWRlciIsInZhbHVlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/components/ui/MultiplayerProvider.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/index.scss */ \"(pages-dir-node)/./src/styles/index.scss\");\n/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_index_scss__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_App_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/App.scss */ \"(pages-dir-node)/./src/styles/App.scss\");\n/* harmony import */ var _styles_App_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_App_scss__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_ui_MultiplayerProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ui/MultiplayerProvider */ \"(pages-dir-node)/./src/components/ui/MultiplayerProvider.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_ui_MultiplayerProvider__WEBPACK_IMPORTED_MODULE_3__]);\n_components_ui_MultiplayerProvider__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_MultiplayerProvider__WEBPACK_IMPORTED_MODULE_3__.MultiplayerProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/davidsheinbein/code/vibe-grid/src/pages/_app.tsx\",\n            lineNumber: 12,\n            columnNumber: 4\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/davidsheinbein/code/vibe-grid/src/pages/_app.tsx\",\n        lineNumber: 11,\n        columnNumber: 3\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBOEI7QUFDRjtBQUUrQztBQUU1RCxTQUFTQyxJQUFJLEVBQzNCQyxTQUFTLEVBQ1RDLFNBQVMsRUFDQztJQUNWLHFCQUNDLDhEQUFDSCxtRkFBbUJBO2tCQUNuQiw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUczQiIsInNvdXJjZXMiOlsiL1VzZXJzL2Rhdmlkc2hlaW5iZWluL2NvZGUvdmliZS1ncmlkL3NyYy9wYWdlcy9fYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9pbmRleC5zY3NzJztcbmltcG9ydCAnLi4vc3R5bGVzL0FwcC5zY3NzJztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgeyBNdWx0aXBsYXllclByb3ZpZGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy91aS9NdWx0aXBsYXllclByb3ZpZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHtcblx0Q29tcG9uZW50LFxuXHRwYWdlUHJvcHMsXG59OiBBcHBQcm9wcykge1xuXHRyZXR1cm4gKFxuXHRcdDxNdWx0aXBsYXllclByb3ZpZGVyPlxuXHRcdFx0PENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuXHRcdDwvTXVsdGlwbGF5ZXJQcm92aWRlcj5cblx0KTtcbn1cbiJdLCJuYW1lcyI6WyJNdWx0aXBsYXllclByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/styles/App.scss":
/*!*****************************!*\
  !*** ./src/styles/App.scss ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "socket.io-client":
/*!***********************************!*\
  !*** external "socket.io-client" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("socket.io-client");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();