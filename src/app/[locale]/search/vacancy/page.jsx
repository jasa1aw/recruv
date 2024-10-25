"use client";
import Header from '@/components/header'
import { useDispatch, useSelector } from 'react-redux';
import { getSearchedVacancies, getSpecializations, getCities, getExperiences, getSkills, getEmpTypes } from '@/app/[locale]/store/slices/vacancySlice';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import ModalSelectSpec from '@/components/ModalSelectSpec'
import AutoCompliteSelect from '@/components/AutoCompliteSelect'
import MyVacancies from '@/components/myVacancies';
import Footer from '@/components/footer';
import Search from '@/components/header/search';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function SearchVacancy() {
    const t = useTranslations('SearchVacancy');
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [q, setQ] = useState(searchParams.get("q"));
    const [specializationId, setSpecialization] = useState(searchParams.get("specializationId"));
    const [specializationName, setSpecializationName] = useState();
    const [isSpecModalOpen, setSpecModalOpen] = useState(false);
    const [cityId, setCity] = useState(searchParams.get("cityId"));
    const [experienceId, setExperienceId] = useState(searchParams.get("experienceId"));
    const [employmentTypeId, setEmploymentType] = useState(searchParams.get("employmentTypeId"));
    const [salary, setSalary] = useState(searchParams.get("salary"));
    const [salary_type, setSalaryType] = useState(searchParams.get("salary_type"));

    const closeSpecModal = () => {
        setSpecModalOpen(false);
    };

    const handleOnSpecChange = (e) => {
        setSpecializationName(e.target.dataset.name);
        setSpecialization(Number(e.target.value));
        closeSpecModal();
    };

    const handleSearch = () => {
        dispatch(getSearchedVacancies({
            q,
            specializationId,
            cityId,
            experienceId,
            employmentTypeId,
            salary,
            salary_type
        }, router));
    };

    useEffect(() => handleSearch(), [specializationId, cityId, employmentTypeId, salary, salary_type, experienceId]);

    useEffect(() => {
        handleSearch();
        dispatch(getSpecializations());
        dispatch(getCities());
        dispatch(getExperiences());
        dispatch(getSkills());
        dispatch(getEmpTypes());
    }, []);

    const handleChangeExp = e => setExperienceId(e.target.value);

    const cities = useSelector(state => state.vacancy.cities);
    const experiences = useSelector(state => state.vacancy.experiences);
    const empTypes = useSelector(state => state.vacancy.empTypes);

    return (
        <div className='wrapper'>
            <Header />
            <main>
                <div className="container mt7">
                    <Search />
                    <div className='flex'>
                        <fieldset className="fieldset-vertical pt7 flex" style={{ width: '100%' }}>
                            <input 
                                className="input" 
                                placeholder={t('titlePlaceholder')} 
                                type="text" 
                                value={q} 
                                onChange={(e) => setQ(e.target.value)} 
                            />
                        </fieldset>
                        <button className='button button-primary' onClick={handleSearch}>{t('findButton')}</button>
                    </div>
                    <div className='flex'>
                        <div style={{ width: '20%' }}>
                            <fieldset className="fieldset-vertical">
                                <label>{t('specLabel')}</label>
                                {specializationName && <p>{specializationName}</p>}
                                <p className="link" onClick={() => setSpecModalOpen(true)}>{t('specSelectLink')}</p>
                            </fieldset>
                            {isSpecModalOpen && <ModalSelectSpec close={closeSpecModal} onChange={handleOnSpecChange} value={Number(specializationId)} />}

                            <AutoCompliteSelect 
                                placeholder="" 
                                type="text" 
                                label={t('cityLabel')} 
                                size="fieldset-md fieldset-vertical" 
                                items={cities} 
                                onSelect={(data) => setCity(data.id)} 
                            />

                            <fieldset className="fieldset-vertical fieldset-md">
                                <label>{t('salaryLabel')}</label>
                                <div className="input-group">
                                    <input 
                                        className="input" 
                                        placeholder={t('salaryPlaceholder')} 
                                        type="text" 
                                        value={salary} 
                                        onChange={(e) => setSalary(e.target.value)} 
                                    />
                                    <select 
                                        className="input" 
                                        name="salary_type" 
                                        value={salary_type} 
                                        onChange={(e) => setSalaryType(e.target.value)}
                                    >
                                        <option value="KZT">{t('currencyKZT')}</option>
                                        <option value="USD">{t('currencyUSD')}</option>
                                        <option value="RUB">{t('currencyRUB')}</option>
                                    </select>
                                </div>
                            </fieldset>

                            <fieldset className="fieldset-vertical fieldset-md">
                                <label>{t('experienceLabel')}</label>
                                <div>
                                    {experiences.map(exp => (
                                        <div className="radio" key={exp.id}>
                                            <input type="radio" value={exp.id} name="exp" onChange={handleChangeExp} />
                                            <label>{exp.duration}</label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>

                            <fieldset className="fieldset-vertical fieldset-md">
                                <label>{t('employmentTypeLabel')}</label>
                                <div>
                                    {empTypes.map(et => (
                                        <div className="radio" key={et.id}>
                                            <input type="radio" value={et.id} name="empType" onChange={(e) => setEmploymentType(e.target.value)} />
                                            <label>{et.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                        <div style={{ width: '80%', paddingLeft: '40px' }}>
                            <MyVacancies />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
