document.addEventListener('DOMContentLoaded', function () {
    // ✅ показать модалку
    function showPopup(dialog) {
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            // fallback для Safari или старых браузеров
            dialog.setAttribute("open", "");
        }
    }

    // ❌ закрыть модалку
    function closePopup(dialog) {
        if (typeof dialog.close === "function") {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
        }
    }

    const ifNotAdvertisingDialog = document.querySelector("dialog.popup-lose");
    const ifNotAdvertisingDialogCheck = ifNotAdvertisingDialog.querySelector("input[name=\"advertising_agreement\"]");
    ifNotAdvertisingDialog.querySelector("button.close").addEventListener("click", () => closePopup(ifNotAdvertisingDialog));

    const ifAdvertisingDialog = document.querySelector("dialog.popup-thanks");
    ifAdvertisingDialog.querySelector("button.close").addEventListener("click", () => closePopup(ifAdvertisingDialog));


    const form = document.querySelector('form.form-block');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = form.querySelector('input[name="email"]').value.trim();
        const description = form.querySelector('textarea[name="description"]').value.trim();

        // чекбоксы из верстки
        const agreement = form.querySelector('input[name="agreement"]').checked;
        const publicOffer = form.querySelector('input[name="public_offer"]').checked;
        const advertising = form.querySelector('input[name="advertising_agreement"]').checked;
        if (!email || !agreement || !publicOffer) {
            alert('Ошибка при отправке формы. Проверьте поля и попробуйте снова.');
            return;
        }

        // сейчас нам согласованная версия не нужна — просто шлем "1"
        const formVersion = 1;
        const now = new Date().toISOString(); // используем одно и то же время

        const payload = {
            email: email,
            form_version: formVersion,
            // можешь положить доп. поля прямо в raw_payload на бэке — мы их уже шлём
            consents: [
                {
                    key: "privacy_policy",
                    checked: agreement,
                    checked_at: agreement ? now : null
                },
                {
                    key: "public_offer",
                    checked: publicOffer,
                    checked_at: publicOffer ? now : null
                },
                {
                    key: "marketing_optin",
                    checked: advertising,
                    checked_at: advertising ? now : null
                }
            ],
            // если хочешь, можно отправлять и описание:
            // его бек сохранит в raw_payload, мы так и задумали
            // но в текущей схеме оно не выделено отдельным полем
            // можешь передать отдельно в body, бек просто положит в raw_payload
            description: description
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_HOST ?? ''}/api/v1/submissions`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                // обработка ошибок — можно показать пользователю
                const err = await res.json().catch(() => ({}));
                console.error('Ошибка отправки формы', err);
                alert('Ошибка при отправке формы. Проверьте поля и попробуйте снова.');
                return;
            }

            const data = await res.json();
            localStorage.setItem('submissionId', data.id)
            console.log('Успех:', data);
            showPopup(advertising ? ifAdvertisingDialog : ifNotAdvertisingDialog);
            form.reset();
        } catch (err) {
            console.error('Ошибка сети', err);
            alert('Ошибка сети, попробуйте позже.');
        }
    });

    ifNotAdvertisingDialogCheck.addEventListener("change", async (e) => {
        if (!e.target.checked) return;

        const submissionId = localStorage.getItem("submissionId");
        if (!submissionId) {
            console.warn("submissionId не найден в localStorage");
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_HOST ?? ''}/api/v1/submissions/${submissionId}/email`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ marketing_optin: true }),
        });

        if (res.ok) {
            // закрываем модалку
            closePopup(ifNotAdvertisingDialog);
            showPopup(ifAdvertisingDialog);
        } else {
            alert("Ошибка при обновлении согласия");
        }
        e.target.checked = false;
    });
});
